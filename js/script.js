// Menu Data
const menuItems = {
    1: {
        id: 1,
        title: "Risoto de Cogumelos",
        desc: "Um clássico da culinária italiana. Arroz arbóreo cozido lentamente em caldo de legumes caseiro, finalizado com manteiga de ervas e queijo parmesão de cura 12 meses.",
        ingredients: "Arroz arbóreo, shitake, shimeji, paris, manteiga, parmesão, vinho branco.",
        price: 58.00,
        img: "./img/04.jpg"
    },
    2: {
        id: 2,
        title: "Salmão Grelhado",
        desc: "Posta de salmão fresco grelhada na perfeição, com pele crocante. Servido sobre cama de purê de batata baroa (mandioquinha) e aspargos salteados no azeite.",
        ingredients: "Salmão fresco, batata baroa, aspargos, azeite extra virgem, limão siciliano.",
        price: 72.00,
        img: "./img/01.jpg"
    },
    3: {
        id: 3,
        title: "Filé Mignon ao Molho Madeira",
        desc: "Medalhão de filé mignon alto e suculento, grelhado ao ponto de sua preferência. Regado com nosso molho madeira artesanal reduzido por 48 horas.",
        ingredients: "Filé mignon, vinho madeira, caldo de carne, batatas, alecrim.",
        price: 85.00,
        img: "./img/02.jpg"
    },
    4: {
        id: 4,
        title: "Pasta Carbonara",
        desc: "A autêntica receita romana. Sem creme de leite. A cremosidade vem da emulsão perfeita entre ovos, queijo pecorino romano e a água do cozimento da massa.",
        ingredients: "Spaghetti grano duro, ovos caipiras, guanciale, pecorino romano, pimenta do reino.",
        price: 49.00,
        img: "./img/03.webp"
    },
    5: {
        id: 5,
        title: "Bruschetta Clássica",
        desc: "Entrada leve e saborosa. Fatias de pão italiano rústico tostadas na brasa, esfregadas com alho fresco e cobertas com tomates maduros picados, manjericão e azeite de oliva extra virgem.",
        ingredients: "Pão italiano, tomate italiano, manjericão fresco, alho, azeite extra virgem, flor de sal.",
        price: 32.00,
        img: "./img/08.jpg"
    },
    6: {
        id: 6,
        title: "Tiramisù",
        desc: "A sobremesa que levanta o ânimo. Camadas alternadas de biscoitos savoiardi embebidos em café espresso forte e um creme aveludado de mascarpone e ovos, finalizado com cacau em pó.",
        ingredients: "Queijo mascarpone, ovos, café espresso, biscoito savoiardi (champagne), açúcar, cacau em pó.",
        price: 38.00,
        img: "./img/07.jpg"
    }
};

// State
let cart = [];

// Elements
const modal = document.getElementById("dish-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalIngredients = document.getElementById("modal-ingredients-text");
const modalPrice = document.getElementById("modal-price");
const modalAddBtn = document.getElementById("modal-add-btn");
const closeModal = document.querySelector(".close-modal");

const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCountBubble = document.getElementById("cart-count");

function openModal(id) {
    const item = menuItems[id];
    if (item) {
        modalImg.src = item.img;
        modalTitle.innerText = item.title;
        modalDesc.innerText = item.desc;
        modalIngredients.innerText = item.ingredients;
        modalPrice.innerText = formatCurrency(item.price);
        
        modalAddBtn.onclick = () => {
            addToCart(id);
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            toggleCart();
        };

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

closeModal.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

const modalOverlayBg = document.querySelector(".modal-overlay-bg");

window.onclick = function(event) {
    if (event.target == modal || event.target == modalOverlayBg) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function toggleCart() {
    cartSidebar.classList.toggle("open");
    cartOverlay.classList.toggle("open");
    if (cartSidebar.classList.contains("open")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}

function addToCart(id) {
    const item = menuItems[id];
    const existingItem = cart.find(cartItem => cartItem.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            ...item,
            qty: 1
        });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function changeQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update Count
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCountBubble.innerText = totalCount;

    // Render Items
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Seu carrinho está vazio</div>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                        <i class="fas fa-trash-alt remove-item" onclick="removeFromCart(${item.id})"></i>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }


    cartTotalPrice.innerText = formatCurrency(total);
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}



// Mobile Menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = navLinks.style.display === "flex";
    
    if (isVisible) {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "80px";
        navLinks.style.left = "0";
        navLinks.style.width = "100%";
        navLinks.style.background = "rgba(12, 11, 9, 0.98)";
        navLinks.style.padding = "20px";
        navLinks.style.textAlign = "center";
    }
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (navLinks.style.display === "flex" && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.style.display = "none";
    }
});

// Close menu when clicking a link
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        // Check if we are in mobile view (checking display property usually set by JS)
        if (navLinks.style.position === "absolute") {
            navLinks.style.display = "none";
        }
    });
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
        header.style.padding = "0";
        header.style.backgroundColor = "rgba(12, 11, 9, 1)";
    } else {
        header.style.padding = "10px 0"; // A bit taller initially
        header.style.backgroundColor = "rgba(12, 11, 9, 0.95)";
    }
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
});

// Reservation Form
const form = document.getElementById("reservation-form");
if(form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        alert(`Obrigado, ${name}! Sua reserva foi solicitada. Aguarde nosso contato.`);
        form.reset();
    });
}
