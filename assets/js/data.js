/*!
 * DeliBites – menu data
 * Edit this list to change dishes across the menu, dish details and cart pages.
 * Fields: id, name, category, price, oldPrice (optional), rating, reviews,
 *         time (prep minutes), kcal, tag (optional badge), veg, desc, img
 */
window.DELIBITES_MENU = [
  { id: "classic-burger", name: "Classic Smash Burger", category: "burgers", price: 12.5, rating: 4.9, reviews: 312, time: 15, kcal: 720, tag: "Bestseller", veg: false, desc: "Two smashed beef patties, aged cheddar, pickles and our house sauce on a toasted brioche bun.", img: "assets/img/dish-classic-burger.svg" },
  { id: "bbq-bacon-burger", name: "BBQ Bacon Burger", category: "burgers", price: 14.0, oldPrice: 16.0, rating: 4.7, reviews: 188, time: 18, kcal: 860, tag: "-12%", veg: false, desc: "Smoky BBQ glaze, crispy bacon, onion rings and smoked gouda.", img: "assets/img/dish-bbq-bacon-burger.svg" },
  { id: "margherita", name: "Margherita Napoletana", category: "pizza", price: 11.0, rating: 4.8, reviews: 401, time: 12, kcal: 640, tag: "Chef's pick", veg: true, desc: "San Marzano tomato, fior di latte, fresh basil and extra-virgin olive oil on a 48-hour dough.", img: "assets/img/dish-margherita.svg" },
  { id: "pepperoni", name: "Spicy Pepperoni", category: "pizza", price: 13.5, rating: 4.7, reviews: 276, time: 14, kcal: 790, veg: false, desc: "Cup-and-char pepperoni, mozzarella, chilli honey and oregano.", img: "assets/img/dish-pepperoni.svg" },
  { id: "carbonara", name: "Roman Carbonara", category: "pasta", price: 13.0, rating: 4.9, reviews: 254, time: 16, kcal: 710, tag: "Bestseller", veg: false, desc: "Spaghetti, guanciale, pecorino romano, egg yolk and cracked black pepper.", img: "assets/img/dish-carbonara.svg" },
  { id: "garlic-noodles", name: "Spicy Garlic Noodles", category: "pasta", price: 10.5, rating: 4.6, reviews: 143, time: 12, kcal: 580, veg: true, desc: "Wok-tossed noodles with crispy garlic, chilli oil, scallions and sesame.", img: "assets/img/dish-garlic-noodles.svg" },
  { id: "greek-salad", name: "Greek Village Salad", category: "salads", price: 9.0, rating: 4.6, reviews: 98, time: 8, kcal: 320, veg: true, desc: "Heirloom tomatoes, cucumber, kalamata olives, red onion and barrel-aged feta.", img: "assets/img/dish-greek-salad.svg" },
  { id: "green-bowl", name: "Green Goddess Bowl", category: "salads", price: 11.5, rating: 4.8, reviews: 167, time: 10, kcal: 410, tag: "New", veg: true, desc: "Quinoa, avocado, edamame, kale and a creamy herb dressing.", img: "assets/img/dish-green-bowl.svg" },
  { id: "grilled-salmon", name: "Grilled Atlantic Salmon", category: "seafood", price: 19.0, rating: 4.8, reviews: 121, time: 20, kcal: 540, veg: false, desc: "Lemon-butter salmon fillet with herbed potatoes and charred greens.", img: "assets/img/dish-grilled-salmon.svg" },
  { id: "garlic-prawns", name: "Garlic Butter Prawns", category: "seafood", price: 17.5, oldPrice: 20.0, rating: 4.7, reviews: 89, time: 15, kcal: 480, tag: "-12%", veg: false, desc: "Tiger prawns sizzled in garlic butter, white wine and parsley.", img: "assets/img/dish-garlic-prawns.svg" },
  { id: "ribeye-steak", name: "Dry-Aged Ribeye", category: "grill", price: 28.0, rating: 4.9, reviews: 203, time: 25, kcal: 920, tag: "Premium", veg: false, desc: "300g dry-aged ribeye, chimichurri and hand-cut fries.", img: "assets/img/dish-ribeye-steak.svg" },
  { id: "chicken-skewers", name: "Charred Chicken Skewers", category: "grill", price: 14.5, rating: 4.6, reviews: 134, time: 18, kcal: 560, veg: false, desc: "Yogurt-marinated chicken thighs, garlic sauce and flatbread.", img: "assets/img/dish-chicken-skewers.svg" },
  { id: "lava-cake", name: "Molten Lava Cake", category: "desserts", price: 7.5, rating: 4.9, reviews: 288, time: 10, kcal: 480, tag: "Bestseller", veg: true, desc: "Dark chocolate cake with a liquid centre and vanilla bean ice cream.", img: "assets/img/dish-lava-cake.svg" },
  { id: "berry-cheesecake", name: "Berry Cheesecake", category: "desserts", price: 6.5, rating: 4.7, reviews: 156, time: 5, kcal: 420, veg: true, desc: "New York-style cheesecake topped with a mixed berry compote.", img: "assets/img/dish-berry-cheesecake.svg" },
  { id: "mango-smoothie", name: "Mango Passion Smoothie", category: "drinks", price: 5.5, rating: 4.8, reviews: 112, time: 5, kcal: 210, veg: true, desc: "Alphonso mango, passion fruit, banana and coconut milk.", img: "assets/img/dish-mango-smoothie.svg" },
  { id: "iced-latte", name: "Iced Caramel Latte", category: "drinks", price: 4.5, rating: 4.6, reviews: 95, time: 4, kcal: 180, tag: "New", veg: true, desc: "Double espresso, salted caramel and cold milk over ice.", img: "assets/img/dish-iced-latte.svg" }
];

/* Shop settings */
window.DELIBITES_CONFIG = {
  currency: "$",
  deliveryFee: 2.99,
  freeDeliveryOver: 30,
  taxRate: 0.08,
  coupons: { WELCOME10: 0.10, DELI20: 0.20 }
};
