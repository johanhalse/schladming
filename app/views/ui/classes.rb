module UI
  module Classes
    H1 = %w[block mt-6 mb-4 text-2xl font-light]
    BUTTON_ALERT = %w[p-3 cursor-pointer text-white bg-red-600 hover:bg-red-700 transition-colors]
    BUTTON_PRIMARY = %w[p-3 cursor-pointer text-white bg-orange-500 hover:bg-orange-600 transition-colors]
    BUTTON_SECONDARY = %w[p-3 cursor-pointer bg-lime-400 hover:bg-lime-500 transition-colors]
    FIELD_CONTAINER = %w[w-full @lg:flex gap-2 items-center mt-2 first:mt-0 fc]
    FIELD_INPUT = %w[block w-full @lg:w-auto @lg:grow text-neutral-600 rounded border-neutral-300 fi]
    FIELD_LABEL = %w[block font-medium text-sm mb-0.5 @lg:mb-0 @lg:w-36 fl]
    LINK = %w[text-cyan-700 hover:text-cyan-500 transition-colors]
    PILL_BUTTON = %w[inline-block text-white bg-orange-500 hover:bg-orange-600 px-2 py-0.5 transition-colors]
    TAB = %w[block text-sm px-2 py-1 transition-colors]
    TAB_NEUTRAL = %w[bg-neutral-200 hover:bg-neutral-300]
    TAB_SELECTED = %w[bg-cyan-200]
  end
end
