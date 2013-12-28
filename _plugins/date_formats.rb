module Jekyll

  module DateFormats

    def date_day(input)
      input.gsub(/^0/, "")
    end

    def date_rus_month(input)
      id = input.strftime("%m")
      case id
      when "01"
        "января"
      when "02"
        "февраля"
      when "03"
        "марта"
      when "04"
        "апреля"
      when "05"
        "мая"
      when "06"
        "июня"
      when "07"
        "июля"
      when "08"
        "августа"
      when "09"
        "сентября"
      when "10"
        "октября"
      when "11"
        "ноября"
      when "12"
        "декабря"
      end
    end

  end

end

Liquid::Template.register_filter(Jekyll::DateFormats)
