from flask import Blueprint, request, jsonify
from extensions import db  # Import from extensions
from models import Product

product_bp = Blueprint('product', __name__)

@product_bp.route('/add', methods=['POST'])
def add_product():
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        image_url=data['image_url'],
        price=data['price'],
        rarity=data['rarity'],
        weapon_type=data['weapon_type']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(message='Product added successfully'), 201

@product_bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.all()
    product_list = [
        {
            "name": product.name,
            "image_url": product.image_url,
            "price": product.price,
            "rarity": product.rarity,
            "weapon_type": product.weapon_type
        }
        for product in products
    ]
    return jsonify(product_list)
