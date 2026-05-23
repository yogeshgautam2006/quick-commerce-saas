from pydantic import BaseModel
from typing import List

# --- PRODUCT SCHEMAS ---
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductResponse(ProductCreate):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- NAYE ORDER SCHEMAS ---
# Ek single item jo cart mein hai
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

# Pura Order jo react backend ko bhejega
class OrderCreate(BaseModel):
    total_amount: float
    razorpay_order_id: str
    razorpay_payment_id: str
    items: List[OrderItemCreate] # List of items