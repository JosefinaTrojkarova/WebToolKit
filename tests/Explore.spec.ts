import { mount } from "@vue/test-utils";
import Categories from "~/components/Categories.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Categories Component", () => {
  let wrapper: any;

  const categories = [
    { id: 1, name: "UI Design", active: false },
    { id: 2, name: "UX Design", active: false },
    { id: 3, name: "Prototyping", active: false },
  ];

  beforeEach(() => {
    wrapper = mount(Categories, {
      props: {
        categories,
      },
    });
  });

  it("should render the correct number of categories", () => {
    const buttons = wrapper.findAll(".btn__category");
    expect(buttons.length).toBe(categories.length);
  });

  it("should toggle category active state on click", async () => {
    const button = wrapper.findAll(".btn__category").at(0);
    await button.trigger("click");

    expect(categories[0].active).toBe(true);
    await button.trigger("click");
    expect(categories[0].active).toBe(false);
  });

  it("should emit category-toggled event on click", async () => {
    const button = wrapper.findAll(".btn__category").at(0);
    await button.trigger("click");

    expect(wrapper.emitted("category-toggled")).toBeTruthy();
    expect(wrapper.emitted("category-toggled")[0]).toEqual([categories[0]]);
  });
});
