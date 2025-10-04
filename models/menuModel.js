const db = require('../config/db');

const menuModel = {
  // Obtener todos los ítems del menú
  async getAll() {
    const query = `
      SELECT m.id, m.title, m.description, m.price, m.image_url, m.is_available, 
             m.created_at, m.updated_at, c.id as category_id, c.name as category_name
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      ORDER BY m.created_at DESC
    `;
    
    const result = await db.query(query);
    
    return result.rows.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: Number(item.price),
      category: {
        id: item.category_id,
        name: item.category_name
      },
      imageUrl: item.image_url,
      isAvailable: item.is_available,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  // Obtener ítems destacados (3 primeros)
  async getFeatured() {
    const query = `
      SELECT m.id, m.title, m.description, m.price, m.image_url, m.is_available, 
             m.created_at, m.updated_at, c.id as category_id, c.name as category_name
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE m.is_available = true
      ORDER BY m.created_at DESC
      LIMIT 3
    `;
    
    const result = await db.query(query);
    
    return result.rows.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: Number(item.price),
      category: {
        id: item.category_id,
        name: item.category_name
      },
      imageUrl: item.image_url,
      isAvailable: item.is_available,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  // Crear un nuevo ítem de menú
  async create(menuData) {
    const { title, description, price, category, imageUrl, isAvailable } = menuData;
    
    const query = `
      INSERT INTO menu_items (title, description, price, category_id, image_url, is_available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, price, category_id, image_url, is_available, created_at, updated_at
    `;
    
    const result = await db.query(query, [title, description, price, category.id, imageUrl, isAvailable]);
    const item = result.rows[0];
    
    // Obtener el nombre de la categoría
    const categoryQuery = 'SELECT name FROM categories WHERE id = $1';
    const categoryResult = await db.query(categoryQuery, [item.category_id]);
    
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: Number(item.price),
      category: {
        id: item.category_id,
        name: categoryResult.rows[0].name
      },
      imageUrl: item.image_url,
      isAvailable: item.is_available,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    };
  },
  
  // Actualizar un ítem de menú
  async update(id, menuData) {
    const { title, description, price, category, imageUrl, isAvailable } = menuData;
    
    const query = `
      UPDATE menu_items
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          category_id = COALESCE($4, category_id),
          image_url = COALESCE($5, image_url),
          is_available = COALESCE($6, is_available),
          updated_at = NOW()
      WHERE id = $7
      RETURNING id, title, description, price, category_id, image_url, is_available, created_at, updated_at
    `;
    
    const categoryId = category ? category.id : null;
    
    const result = await db.query(query, [
      title, description, price, categoryId, imageUrl, isAvailable, id
    ]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const item = result.rows[0];
    
    // Obtener el nombre de la categoría
    const categoryQuery = 'SELECT name FROM categories WHERE id = $1';
    const categoryResult = await db.query(categoryQuery, [item.category_id]);
    
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: Number(item.price),
      category: {
        id: item.category_id,
        name: categoryResult.rows[0].name
      },
      imageUrl: item.image_url,
      isAvailable: item.is_available,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    };
  },
  
  // Eliminar un ítem de menú
  async delete(id) {
    const query = 'DELETE FROM menu_items WHERE id = $1';
    await db.query(query, [id]);
    return true;
  }
};

module.exports = menuModel;