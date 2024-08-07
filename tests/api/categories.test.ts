import { describe, it, expect } from 'vitest';

const API_BASE_URL = 'http://localhost:3000'; // Development server URL

describe('Categories API Tests', () => {
  it('fetches categories data correctly', async () => {
    const response = await fetch(`${API_BASE_URL}/api/tool/categories`);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    // Check the structure of the first item
    if (data.length > 0) {
      const firstItem = data[0];
      expect(firstItem).toHaveProperty('_id');
      expect(firstItem).toHaveProperty('name');
    }
  });
});
