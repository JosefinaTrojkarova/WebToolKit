interface DropdownItem {
  id: number;
  state: boolean;
}

export const useDropdown = (ids: number[]) => {
  const isDropdownOpen: Ref<DropdownItem[]> = ref(
    ids.map((id) => ({ id, state: false }))
  );

  const openDropdown = (id: number) => {
    if (isDropdownOpen.value[id]) {
      isDropdownOpen.value[id].state = true;
    }
  };

  const closeDropdown = (id: number) => {
    if (isDropdownOpen.value[id]) {
      isDropdownOpen.value[id].state = false;
    }
  };

  return {
    isDropdownOpen,
    openDropdown,
    closeDropdown,
  };
};