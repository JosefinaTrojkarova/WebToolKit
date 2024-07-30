import { mount } from '@vue/test-utils';
import Categories from '~/components/Categories.vue';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Categories Component', () => {
  let wrapper: any;
  let buttons: ReturnType<typeof wrapper.findAll>;

  // Sample categories to be passed as props to the component
  const categories = [
    { id: 1, name: 'UI Design', active: false },
    { id: 2, name: 'UX Design', active: false },
    { id: 3, name: 'Prototyping', active: false },
    { id: 4, name: 'JavaScript', active: false },
    { id: 5, name: 'TypeScript', active: false },
    { id: 6, name: 'Python', active: false },
    { id: 7, name: 'Framework', active: false },
    { id: 8, name: 'CSS', active: false },
    { id: 9, name: 'Hosting', active: false },
    { id: 10, name: 'Compiling', active: false },
    { id: 11, name: 'HTML', active: false },
  ];

  beforeEach(() => {
    wrapper = mount(Categories, {
      props: {
        categories,
      },
    });
    buttons = wrapper.findAll('.btn__category');
  });

  it('should render the correct number of categories', () => {
    // Check that the number of buttons matches the length of the categories array
    expect(buttons.length).toBe(categories.length);
  });

  it('should toggle category active state on click', async () => {
    const button = wrapper.findAll('.btn__category').at(0);

    await button.trigger('click'); // Simulate a click event on the button
    expect(categories[0].active).toBe(true); // Check that the first category is now active

    await button.trigger('click');
    expect(categories[0].active).toBe(false);
  });
});
