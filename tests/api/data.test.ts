import { describe, it, expect } from 'vitest';

const API_BASE_URL = 'http://localhost:3000'; // Development server URL

// Run dev server before testing api
describe('API Tests', () => {
  it('fetches explore data correctly', async () => {
    const response = await fetch(`${API_BASE_URL}/api/data?explore=true`);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    // Check the structure of the first item
    if (data.length > 0) {
      const firstItem = data[0];
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('description');
      expect(firstItem).toHaveProperty('logo');
      expect(firstItem).toHaveProperty('categories');
      expect(firstItem).toHaveProperty('tags');
      expect(firstItem.tags).toHaveProperty('pricing');
      expect(firstItem.tags).toHaveProperty('licensing');
      expect(firstItem).toHaveProperty('rating');
      expect(firstItem.rating).toHaveProperty('stars');
      expect(firstItem.rating).toHaveProperty('reviews');
      expect(firstItem.rating).toHaveProperty('saves');
    }
  });

  it('handles search query correctly', async () => {
    const searchQuery = 'test';
    const response = await fetch(
      `${API_BASE_URL}/api/data?explore=true&search=${encodeURIComponent(
        searchQuery
      )}`
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('fetches contribute data correctly', async () => {
    const response = await fetch(`${API_BASE_URL}/api/data?contribute=true`);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    // Check if we received any data
    expect(data.length).toBeGreaterThan(0);

    // For contribute, we only expect the 'name' and 'id' property
    if (data.length > 0) {
      const firstItem = data[0];
      expect(firstItem).toHaveProperty('name');
      expect(Object.keys(firstItem).length).toBe(2); // Only 'name' and 'id' should be present
    }
  });
});
