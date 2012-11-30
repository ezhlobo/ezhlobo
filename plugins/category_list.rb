module Jekyll

  class CategoryList < Liquid::Tag

    def initialize(tag_name, markup, tokens)
      @opts = {}
      if markup.strip =~ /\s*counter:(\w+)/iu
        @opts['counter'] = ($1 == 'true')
        markup = markup.strip.sub(/counter:\w+/iu,'')
      end
      super
    end

    def render(context)
      list = []
      config = context.registers[:site].config
      category_dir = config['root'] + config['category_dir'] + '/'
      categories = context.registers[:site].categories
      categories.keys.sort_by{ |str| str.downcase }.each do |category|
        url = category_dir + category.gsub(/_|\P{Word}/u, '-').gsub(/-{2,}/u, '-').downcase
        list << "<a href='#{url}' title='#{category}'>#{category}</a>"
      end
      list.join(', ')
    end
  end

end

Liquid::Template.register_tag('category_list', Jekyll::CategoryList)
