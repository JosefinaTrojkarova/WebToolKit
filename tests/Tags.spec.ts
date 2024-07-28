import { mount } from "@vue/test-utils";
import Tags from "~/components/Tags.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Tags Component", () => {
  let wrapper: any;

  const tags = [
    { id: 1, name: "100% Free", active: false },
    { id: 2, name: "Free Version", active: false },
    { id: 3, name: "Free Trial", active: false },
    { id: 4, name: "Paid", active: false },
  ];

  beforeEach(() => {
    wrapper = mount(Tags, {
      props: {
        tags,
        variant: "pricing",
      },
    });
  });

  it("should render the correct number of tags", () => {
    const buttons = wrapper.findAll(".btn__tag");
    expect(buttons.length).toBe(tags.length);
  });

  it("should toggle tag active state on click", async () => {
    const button = wrapper.findAll(".btn__tag").at(0);
    await button.trigger("click");

    expect(tags[0].active).toBe(true);
    await button.trigger("click");
    expect(tags[0].active).toBe(false);
  });

  it("should emit tag-toggled event on click", async () => {
    const button = wrapper.findAll(".btn__tag").at(0);
    await button.trigger("click");

    expect(wrapper.emitted("tag-toggled")).toBeTruthy();
    expect(wrapper.emitted("tag-toggled")[0]).toEqual([tags[0]]);
  });
});
