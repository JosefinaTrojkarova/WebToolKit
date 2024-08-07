import { describe, it, expect } from 'vitest';

const API_BASE_URL = 'http://localhost:3000'; // Development server URL

describe('Specific Tool API Tests', () => {
  const testToolName = 'Figma';

  it('fetches specific tool data correctly', async () => {
    const response = await fetch(`${API_BASE_URL}/api/tool/${testToolName}`);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeInstanceOf(Object);

    // Check the structure of the returned data
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('logo');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('tags');
    expect(data.tags).toHaveProperty('pricing');
    expect(data.tags).toHaveProperty('licensing');
    expect(data).toHaveProperty('rating');
    expect(data.rating).toHaveProperty('reviews');
    expect(data).toHaveProperty('resources');
    expect(data).toHaveProperty('video');
    expect(data).toHaveProperty('pros');
    expect(data).toHaveProperty('cons');
    expect(data).toHaveProperty('alternatives');
  });

  it('fetches header data correctly', async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/tool/${testToolName}?header=true`
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeInstanceOf(Object);

    // Check the structure of the returned header data
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('logo');
    expect(data).toHaveProperty('shortDescription');
    expect(data).toHaveProperty('rating');
    expect(data.rating).toHaveProperty('stars');
    expect(data.rating).toHaveProperty('saves');

    // Ensure that full data is not included
    expect(data).not.toHaveProperty('description');
    expect(data).not.toHaveProperty('resources');
  });

  it('handles non-existent tool correctly', async () => {
    const nonExistentTool = 'NonExistentTool';
    const response = await fetch(`${API_BASE_URL}/api/tool/${nonExistentTool}`);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);

    const errorData = await response.json();
    expect(errorData).toHaveProperty('statusMessage', 'Tool not found');
  });
});
