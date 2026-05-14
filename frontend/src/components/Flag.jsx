import * as Flags from "country-flag-icons/react/3x2";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const Flag = ({ country, size = 18 }) => {
  if (!country) return <span>🌍</span>;

  const iso = countries.getAlpha2Code(country.trim(), "en");
  const Component = iso ? Flags[iso] : null;

  return Component ? <Component width={size} /> : <span>🌍</span>;
};

export default Flag;
