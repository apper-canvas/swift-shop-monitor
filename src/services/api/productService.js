class ProductService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  // Map database fields to UI-friendly names
  mapProductFromDB(dbProduct) {
    return {
      Id: dbProduct.Id,
      title: dbProduct.title_c,
      price: dbProduct.price_c,
      image: dbProduct.image_c,
      category: dbProduct.category_c,
      inStock: dbProduct.in_stock_c,
      description: dbProduct.description_c,
      // Include system fields for reference
      Name: dbProduct.Name,
      Owner: dbProduct.Owner,
      CreatedOn: dbProduct.CreatedOn,
      CreatedBy: dbProduct.CreatedBy,
      ModifiedOn: dbProduct.ModifiedOn,
      ModifiedBy: dbProduct.ModifiedBy,
      Tags: dbProduct.Tags
    };
  }

  // Map UI data to database fields for create/update
  mapProductToDB(product) {
    return {
      title_c: product.title,
      price_c: product.price,
      image_c: product.image,
      category_c: product.category,
      in_stock_c: product.inStock,
      description_c: product.description
    };
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => this.mapProductFromDB(product));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      };

      const response = await this.apperClient.getRecordById('product_c', parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      return this.mapProductFromDB(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "ExactMatch", "Values": [category]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => this.mapProductFromDB(product));
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  }

  async searchProducts(query) {
    try {
      if (!query) return await this.getAll();
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]},
                {"fieldName": "category_c", "operator": "Contains", "values": [query]},
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => this.mapProductFromDB(product));
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getFeaturedProducts(limit = 12) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => this.mapProductFromDB(product));
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getProductVariants(id) {
    // Mock variant data - not in database schema
    // This would typically come from a separate variants table
    return {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Gray", value: "#6b7280" },
        { name: "White", value: "#ffffff" }
      ],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format"
      ]
    };
  }

  async getCategories() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const categories = response.data
        .map(item => item.category_c)
        .filter(category => category && category.trim())
        .sort();

      return [...new Set(categories)];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return [];
    }
  }

  async filterProducts({ searchQuery, category, sortBy, priceRange }) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const whereConditions = [];
      const whereGroups = [];

      // Build search conditions
      if (searchQuery && searchQuery.trim()) {
        whereGroups.push({
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [searchQuery.trim()]},
                {"fieldName": "category_c", "operator": "Contains", "values": [searchQuery.trim()]},
                {"fieldName": "description_c", "operator": "Contains", "values": [searchQuery.trim()]}
              ],
              "operator": "OR"
            }
          ]
        });
      }

      // Add category filter
      if (category && category.trim()) {
        whereConditions.push({
          "FieldName": "category_c",
          "Operator": "ExactMatch",
          "Values": [category]
        });
      }

      // Add price range filter
      if (priceRange && (priceRange.min > 0 || priceRange.max < 500)) {
        if (priceRange.min > 0) {
          whereConditions.push({
            "FieldName": "price_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [priceRange.min]
          });
        }
        if (priceRange.max < 500) {
          whereConditions.push({
            "FieldName": "price_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [priceRange.max]
          });
        }
      }

      // Determine sort order
      let orderBy = [{"fieldName": "Id", "sorttype": "DESC"}];
      switch (sortBy) {
        case 'price-low':
          orderBy = [{"fieldName": "price_c", "sorttype": "ASC"}];
          break;
        case 'price-high':
          orderBy = [{"fieldName": "price_c", "sorttype": "DESC"}];
          break;
        case 'newest':
          orderBy = [{"fieldName": "Id", "sorttype": "DESC"}];
          break;
        case 'popular':
        default:
          orderBy = [{"fieldName": "Id", "sorttype": "ASC"}];
          break;
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: whereConditions,
        whereGroups: whereGroups,
        orderBy: orderBy,
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => this.mapProductFromDB(product));
    } catch (error) {
      console.error("Error filtering products:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ProductService();