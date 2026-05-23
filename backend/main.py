from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import razorpay

# Hamari files
import models, schemas
from database import engine, SessionLocal

# Database tables automatically create karna
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- RAZORPAY SETUP ---
RAZORPAY_KEY_ID = "rzp_test_Ssjh03MmJgBm5u"         # Apni Test Key yahan daalein
RAZORPAY_KEY_SECRET = "iwmrW67Y4M3jzUvwvfGwdI6e" # Apni Secret Key yahan daalein
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class OrderRequest(BaseModel):
    amount: float

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SECURITY & JWT SETUP ---
SECRET_KEY = "my_super_secret_key_for_jwt"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- UTILITY: GET CURRENT LOGGED IN USER ---
# Yeh function token check karke batayega ki kaunsa user logged in hai
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# --- ROUTES (APIs) ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Grocery SaaS API!"}

# 1. SIGNUP API
@app.post("/signup/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 2. LOGIN API
@app.post("/login/", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# 3. NAYA PRODUCT ADD KARNA
@app.post("/products/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# 4. SAARE PRODUCTS DEKHNA
@app.get("/products/", response_model=list[schemas.ProductResponse])
def read_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

# 5. RAZORPAY ORDER GENERATE KARNA
@app.post("/create-order/")
def create_order(order: OrderRequest):
    order_amount = int(order.amount * 100)
    razorpay_order = razorpay_client.order.create(dict(
        amount=order_amount,
        currency="INR",
        payment_capture=1
    ))
    return {"order_id": razorpay_order["id"], "amount": order_amount}

# 🌟 6. NAYA REAL ORDER DATABASE MEIN SAVE KARNA (POST)
# Ismai 'current_user' automatic token se fetch ho raha hai security ke liye
@app.post("/save-order/")
def save_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    
    # Step A: Main Order entry banana
    new_order = models.Order(
        user_id=current_user.id,
        total_amount=order_data.total_amount,
        razorpay_order_id=order_data.razorpay_order_id,
        razorpay_payment_id=order_data.razorpay_payment_id,
        status="Paid"
    )
    db.add(new_order)
    db.commit() # Isse new_order.id generate ho jayegi
    db.refresh(new_order)
    
    # Step B: Cart ke saare items ko 'order_items' table mein loop chalakar save karna
    for item in order_data.items:
        new_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(new_item)
        
        # Step C: Inventory Management (Stock kam karna)
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            product.stock -= item.quantity # Jitna kharida, utna stock se minus kiya
            
    db.commit()
    return {"message": "Order placed and saved successfully!", "order_id": new_order.id}