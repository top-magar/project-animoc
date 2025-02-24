document.addEventListener('DOMContentLoaded', () => {
    // Cart Functionality
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const removeBtns = document.querySelectorAll('.remove-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');

    // Quantity Buttons
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.target.parentNode.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            
            if (e.target.textContent === '+') {
                input.value = currentValue + 1;
            } else if (e.target.textContent === '-' && currentValue > 1) {
                input.value = currentValue - 1;
            }
            
            updateCartTotal();
        });
    });

    // Remove Buttons
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            cartItem.style.opacity = '0';
            setTimeout(() => {
                cartItem.remove();
                updateCartTotal();
                updateCartCount();
            }, 300);
        });
    });

    // Quantity Input Validation
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (parseInt(e.target.value) < 1) {
                e.target.value = 1;
            }
            updateCartTotal();
        });
    });

    // Update cart total
    function updateCartTotal() {
        const items = document.querySelectorAll('.cart-item');
        let subtotal = 0;
        
        items.forEach(item => {
            const price = parseInt(item.querySelector('.price').textContent.replace('RS ', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            subtotal += price * quantity;
        });

        const shipping = 200;
        const total = subtotal + shipping;

        document.querySelector('.summary-row:first-child span:last-child').textContent = `RS ${subtotal}`;
        document.querySelector('.total span:last-child').textContent = `RS ${total}`;
    }

    // Update cart count in navbar
    function updateCartCount() {
        const itemCount = document.querySelectorAll('.cart-item').length;
        const cartText = document.querySelector('.cart');
        cartText.textContent = `CART (${itemCount})`;
    }

    // Initialize cart total
    updateCartTotal();
    
});