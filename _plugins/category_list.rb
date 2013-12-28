module Jekyll

  module CatsFilter

    def category_links(categories)
      dir = @context.registers[:site].config['category_dir']
      categories = categories.sort!.map do |item|
        "<a href='/#{dir}/#{item.gsub(/_|\P{Word}/, '-').gsub(/-{2,}/, '-').downcase}/'>#{item}</a>"
      end

      case categories.length
      when 0
        ""
      when 1
        categories[0].to_s
      else
        "#{categories[0...-1].join(', ')}, #{categories[-1]}"
      end
    end

  end

end

Liquid::Template.register_filter(Jekyll::CatsFilter)
