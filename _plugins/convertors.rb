module Jekyll
  module PreviewFilter
    def preview(input, url)
      re = %r{"}
      m = input.match re
      "asd"
    end
  end
end

Liquid::Template.register_filter(Jekyll::PreviewFilter)
