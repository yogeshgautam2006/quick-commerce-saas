from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    is_active = Column(Boolean, default=True)

# --- NAYI TABLES FOR ORDERS ---

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # Relates to User table
    total_amount = Column(Float)
    razorpay_order_id = Column(String)
    razorpay_payment_id = Column(String)
    status = Column(String, default="Paid") # Status: Paid, Shipped, Delivered
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    items = relationship("OrderItem", back_populates="order")
    user = relationship("User")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id")) # Relates to Order table
    product_id = Column(Integer, ForeignKey("products.id")) # Relates to Product table
    quantity = Column(Integer)
    price = Column(Float) # Product price at the time of purchase

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")