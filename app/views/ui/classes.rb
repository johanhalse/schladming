module UI
  module Classes
    BUTTON_ALERT = %w[p-3 cursor-pointer bg-red-500 hover:bg-red-600 transition-colors]
    BUTTON_PRIMARY = %w[p-3 cursor-pointer bg-orange-400 hover:bg-orange-500 transition-colors]
    BUTTON_SECONDARY = %w[p-3 cursor-pointer bg-lime-400 hover:bg-lime-500 transition-colors]
    FIELD_CONTAINER = %w[w-full @lg:flex gap-2 items-center mt-2 first:mt-0 fc]
    FIELD_INPUT = %w[block w-full @lg:w-auto @lg:grow text-neutral-600 rounded border-neutral-300 fi]
    FIELD_LABEL = %w[block font-medium text-sm mb-0.5 @lg:mb-0 w-36 fl]
    INDEX_SCOPE = %w[block px-2 py-1 transition-colors]
    LINK = %w[text-cyan-700 hover:text-cyan-500 transition-colors]
  end
end
