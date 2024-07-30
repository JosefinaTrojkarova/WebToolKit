import { mountSuspended } from '@nuxt/test-utils/runtime';
import Tags from '~/components/Tags.vue';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Tags Component', () => {
  let wrapper: any;
  let buttons: any;

  // Array of variant configurations to test different types of tags
  const variants = [
    { name: 'pricing', expectedLength: 4 },
    { name: 'licensing', expectedLength: 2 },
    { name: 'rating', expectedLength: 5 },
  ];

  variants.forEach((variant) => {
    describe(`Variant: ${variant.name}`, () => {
      beforeEach(async () => {
        // Mount the component with the specified variant prop
        wrapper = await mountSuspended(Tags, {
          props: {
            variant: variant.name as 'pricing' | 'licensing' | 'rating',
          },
        });
        // Find all buttons with the class '.btn__tag'
        buttons = wrapper.findAll('.btn__tag');
      });

      it('should render the correct number of tags', () => {
        // Check that the number of buttons matches the expected length for the current variant
        expect(buttons.length).toBe(variant.expectedLength);
      });

      it('should toggle tag active state on click', async () => {
        for (let i = 0; i < buttons.length; i++) {
          const button = buttons[i];

          if (button) {
            // Get the tag associated with the button and ensure it's initially inactive
            const tag = wrapper.vm.computedTags[i];
            expect(tag.active).toBe(false);

            // Simulate click: Tag should become active
            await button.trigger('click');
            expect(tag.active).toBe(true);

            // Simulate another click: Tag should revert to inactive
            await button.trigger('click');
            expect(tag.active).toBe(false);
          }
        }
      });
    });
  });
});
