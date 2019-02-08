import React from 'react';
import { string, shape } from 'prop-types';
import Helmet from 'react-helmet';
import { ServiceContextConsumer } from '../../contexts/ServiceContext';
import { PlatformContextConsumer } from '../../contexts/PlatformContext';
import Metadata from '../../components/Metadata';
import metadataPropTypes from '../../models/propTypes/metadata';
import promoPropTypes from '../../models/propTypes/promo';

const passAttributesToHtml = isAmp => {
  const htmlAttributes = {};

  if (isAmp) {
    htmlAttributes.amp = ''; // empty value as this makes Helmet render 'amp' as per https://www.ampproject.org/docs/fundamentals/spec#ampd
  }

  return (
    <ServiceContextConsumer>
      {({ dir, lang }) => (
        <Helmet
          htmlAttributes={{
            ...htmlAttributes,
            ...{ dir },
            ...{ lang },
          }}
        />
      )}
    </ServiceContextConsumer>
  );
};

/* An array of each thingLabel from tags.about & tags.mention */
const allTags = tags => {
  const { about, mentions } = tags;
  const aboutTags = about ? about.map(thing => thing.thingLabel) : [];
  const mentionTags = mentions ? mentions.map(thing => thing.thingLabel) : [];
  return aboutTags.concat(mentionTags);
};

const MetadataContainer = ({ metadata, promo, service }) => {
  const { id: aresArticleId } = metadata;

  if (!aresArticleId) {
    return null;
  }

  const id = aresArticleId.split(':').pop();
  /* Canonical link generated from servicename and id */
  const canonicalLink = `https://www.bbc.com/${service}/articles/${id}`;
  const timeFirstPublished = new Date(metadata.firstPublished).toISOString();
  const timeLastPublished = new Date(metadata.lastPublished).toISOString();
  const isAmp = platform => (platform === 'amp');
  return (
    <PlatformContextConsumer>
      {platform => (
        <ServiceContextConsumer>
          {({
            brandName,
            articleAuthor,
            defaultImage,
            defaultImageAltText,
            locale,
            twitterCreator,
            twitterSite,
          }) => (
            {passAttributesToHtml(isAmp)}
            <Metadata
              articleAuthor={articleAuthor}
              articleSection={metadata.passport.genre}
              brandName={brandName}
              canonicalLink={canonicalLink}
              defaultImage={defaultImage}
              defaultImageAltText={defaultImageAltText}
              description={promo.summary}
              facebookAdmin={100004154058350}
              facebookAppID={1609039196070050}
              lang={metadata.passport.language}
              locale={locale}
              metaTags={allTags(metadata.tags)}
              timeFirstPublished={timeFirstPublished}
              timeLastPublished={timeLastPublished}
              title={promo.headlines.seoHeadline}
              twitterCreator={twitterCreator}
              twitterSite={twitterSite}
              type={metadata.type}
            />
          )}
        </ServiceContextConsumer>
      )}
    </PlatformContextConsumer>
  );
};

MetadataContainer.propTypes = {
  metadata: shape(metadataPropTypes).isRequired,
  promo: shape(promoPropTypes).isRequired,
  service: string.isRequired,
};

export default MetadataContainer;