import { Helmet } from "react-helmet-async";

const Seo = ({
  title,
  description,
  url,
  keywords
}) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      {keywords && (
        <meta
          name="keywords"
          content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
        />
      )}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default Seo;