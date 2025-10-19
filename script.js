const products = [
  {
    id: 1,
    name: "Labial Mate Rojo Intenso",
    description: "Larga duración, acabado aterciopelado",
    price: 59500,
    originalPrice: 85000,
    image: "/red-matte-lipstick.jpg",
    hasDiscount: true,
  },
  {
    id: 2,
    name: "Paleta Nude Essentials",
    description: "12 tonos neutros versátiles",
    price: 125000,
    originalPrice: null,
    image: "/nude-eyeshadow-palette.jpg",
    hasDiscount: false,
  },
  {
    id: 3,
    name: "Base Líquida HD",
    description: "Cobertura completa, acabado natural",
    price: 71250,
    originalPrice: 95000,
    image: "/liquid-foundation-bottle.jpg",
    hasDiscount: true,
  },
  {
    id: 4,
    name: "Máscara Volumen Extremo",
    description: "Pestañas largas y definidas",
    price: 68000,
    originalPrice: null,
    image: "/mascara-wand-makeup.jpg",
    hasDiscount: false,
  },
  {
    id: 5,
    name: "Rubor Luminoso",
    description: "Acabado radiante y natural",
    price: 33000,
    originalPrice: 55000,
    image: "/blush-compact-powder.jpg",
    hasDiscount: true,
  },
  {
    id: 6,
    name: "Delineador Líquido Precision",
    description: "Trazo perfecto y duradero",
    price: 42000,
    originalPrice: null,
    image: "/liquid-eyeliner-pen.jpg",
    hasDiscount: false,
  },
  {
    id: 7,
    name: "Iluminador Golden Glow",
    description: "Brillo natural y sofisticado",
    price: 50700,
    originalPrice: 78000,
    image: "/highlighter-makeup-compact.jpg",
    hasDiscount: true,
  },
  {
    id: 8,
    name: "Gloss Hidratante Crystal",
    description: "Brillo intenso con vitamina E",
    price: 38500,
    originalPrice: null,
    image: "/lip-gloss-tube.jpg",
    hasDiscount: false,
  },
]

let cart = []
let currentSlide = 0
let currentStep = 1

function formatPrice(price) {
  return `$${price.toLocaleString("es-CO")}`
}

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar")
  const overlay = document.getElementById("overlay")
  sidebar.classList.toggle("active")
  overlay.classList.toggle("active")
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCart()
  showNotification("Producto agregado al carrito")

  const button = event.target
  button.style.transform = "scale(0.9)"
  setTimeout(() => {
    button.style.transform = "scale(1)"
  }, 200)
}

function updateCart() {
  const cartItems = document.getElementById("cartItems")
  const cartCount = document.querySelector(".cart-count")
  const cartTotal = document.getElementById("cartTotal")

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = totalItems
  cartTotal.textContent = formatPrice(totalPrice)

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>'
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeItem(${item.id})">✕</button>
            </div>
        `,
      )
      .join("")
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== productId)
    }
    updateCart()
  }
}

function removeItem(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCart()
  showNotification("Producto eliminado del carrito")
}

function showNotification(message) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #d4a574 0%, #c97d60 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(201, 125, 96, 0.4);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 2500)
}

function goToCheckout() {
  if (cart.length === 0) {
    showNotification("Tu carrito está vacío")
    return
  }

  toggleCart()
  document.getElementById("checkoutModal").classList.add("active")
  document.getElementById("overlay").classList.add("active")
  updateCheckoutSummary()
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("active")
  document.getElementById("overlay").classList.remove("active")
  currentStep = 1
  showStep(1)
}

function showStep(step) {
  document.querySelectorAll(".checkout-step-content").forEach((content) => {
    content.classList.add("hidden")
  })
  document.getElementById(`step${step}`).classList.remove("hidden")

  document.querySelectorAll(".step").forEach((s) => {
    s.classList.remove("active")
  })
  document.querySelector(`.step[data-step="${step}"]`).classList.add("active")
}

function nextStep() {
  if (currentStep < 3) {
    currentStep++
    showStep(currentStep)
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--
    showStep(currentStep)
  }
}

function updateCheckoutSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15000
  const total = subtotal + shipping

  document.getElementById("summarySubtotal").textContent = formatPrice(subtotal)
  document.getElementById("summaryTotal").textContent = formatPrice(total)
}

function completeOrder() {
  document.getElementById("step3").classList.add("hidden")
  document.getElementById("confirmation").classList.remove("hidden")

  setTimeout(() => {
    cart = []
    updateCart()
  }, 1000)
}

function moveCarousel(direction) {
  const slides = document.querySelectorAll(".carousel-slide")
  currentSlide = (currentSlide + direction + slides.length) % slides.length
  updateCarousel()
}

function goToSlide(index) {
  currentSlide = index
  updateCarousel()
}

function updateCarousel() {
  const track = document.querySelector(".carousel-track")
  const slides = document.querySelectorAll(".carousel-slide")
  const dots = document.querySelectorAll(".dot")

  track.style.transform = `translateX(-${currentSlide * 100}%)`

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide)
  })

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide)
  })
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function filterProducts(category) {
  showNotification(`Mostrando productos de ${category}`)
  scrollToSection("productos")
}

setInterval(() => {
  const slides = document.querySelectorAll(".carousel-slide")
  currentSlide = (currentSlide + 1) % slides.length
  updateCarousel()
}, 5000)

document.getElementById("overlay").addEventListener("click", () => {
  const cartSidebar = document.getElementById("cartSidebar")
  const checkoutModal = document.getElementById("checkoutModal")

  if (cartSidebar.classList.contains("active")) {
    toggleCart()
  }
  if (checkoutModal.classList.contains("active")) {
    closeCheckout()
  }
})

updateCart()
