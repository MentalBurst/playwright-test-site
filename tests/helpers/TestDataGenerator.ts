import * as fs from 'fs';
import * as path from 'path';

interface TestData {
  users: User[];
  products: Product[];
  companies: Company[];
}

interface User {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string;
  bio: string;
}

interface Product {
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

interface Company {
  name: string;
  industry: string;
  employees: number;
}

export class TestDataGenerator {
  private static instance: TestDataGenerator;
  private data: TestData;

  private constructor() {
    this.data = this.generateData();
  }

  static getInstance(): TestDataGenerator {
    if (!TestDataGenerator.instance) {
      TestDataGenerator.instance = new TestDataGenerator();
    }
    return TestDataGenerator.instance;
  }

  private generateData(): TestData {
    return {
      users: this.generateUsers(10),
      products: this.generateProducts(20),
      companies: this.generateCompanies(5),
    };
  }

  private generateUsers(count: number): User[] {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily', 'Robert', 'Olivia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const bios = ['QA Engineer', 'Software Developer', 'Product Manager', 'UX Designer', 'Data Analyst'];

    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${i}`;
      
      users.push({
        username,
        password: `Pass${Math.floor(Math.random() * 10000)}!`,
        email: `${username}@example.com`,
        fullName: `${firstName} ${lastName}`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        bio: bios[Math.floor(Math.random() * bios.length)],
      });
    }
    return users;
  }

  private generateProducts(count: number): Product[] {
    const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];
    const productNames = {
      electronics: ['Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'Headphones', 'Camera'],
      clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers', 'Dress', 'Sweater'],
      books: ['Novel', 'Biography', 'Cookbook', 'Guide', 'Textbook', 'Comic'],
      home: ['Chair', 'Table', 'Lamp', 'Rug', 'Curtains', 'Mirror'],
      sports: ['Basketball', 'Tennis Racket', 'Yoga Mat', 'Dumbbell', 'Bicycle', 'Helmet'],
    };

    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const names = productNames[category as keyof typeof productNames];
      const name = names[Math.floor(Math.random() * names.length)];
      const adjective = ['Premium', 'Deluxe', 'Pro', 'Ultimate', 'Essential'][Math.floor(Math.random() * 5)];
      
      products.push({
        name: `${adjective} ${name}`,
        category,
        price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        description: `High-quality ${name.toLowerCase()} perfect for everyday use`,
        inStock: Math.random() > 0.2,
      });
    }
    return products;
  }

  private generateCompanies(count: number): Company[] {
    const companyNames = ['Tech Corp', 'Digital Solutions', 'Innovation Labs', 'Cloud Systems', 'Data Dynamics'];
    const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'];

    const companies: Company[] = [];
    for (let i = 0; i < count; i++) {
      companies.push({
        name: companyNames[i % companyNames.length],
        industry: industries[Math.floor(Math.random() * industries.length)],
        employees: Math.floor(Math.random() * 1000) + 50,
      });
    }
    return companies;
  }

  getRandomUser(): User {
    return this.data.users[Math.floor(Math.random() * this.data.users.length)];
  }

  getRandomProduct(): Product {
    return this.data.products[Math.floor(Math.random() * this.data.products.length)];
  }

  getRandomCompany(): Company {
    return this.data.companies[Math.floor(Math.random() * this.data.companies.length)];
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username === username);
  }

  getAllUsers(): User[] {
    return this.data.users;
  }

  getAllProducts(): Product[] {
    return this.data.products;
  }

  /**
   * Generate unique test data for a specific test
   */
  generateUniqueUser(): User {
    const timestamp = Date.now();
    return {
      username: `testuser_${timestamp}`,
      password: `Pass${timestamp}!`,
      email: `test${timestamp}@example.com`,
      fullName: `Test User ${timestamp}`,
      phone: `+1 (555) ${String(timestamp).slice(-7)}`,
      bio: 'Automated Test User',
    };
  }

  generateUniqueProduct(): Product {
    const timestamp = Date.now();
    const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];
    
    return {
      name: `Test Product ${timestamp}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
      description: `Test product created at ${new Date(timestamp).toISOString()}`,
      inStock: true,
    };
  }

  /**
   * Save test data to file for reference
   */
  saveToFile(filename: string = 'test-data.json') {
    const dataPath = path.join(process.cwd(), 'test-results', filename);
    const dir = path.dirname(dataPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(dataPath, JSON.stringify(this.data, null, 2));
    console.log(`Test data saved to: ${dataPath}`);
  }
}

