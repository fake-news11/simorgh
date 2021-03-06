import React from 'react';
import renderer from 'react-test-renderer';
import Helmet from 'react-helmet';
import MetadataContainer from './index';
import { ServiceContextProvider } from '../../contexts/ServiceContext';
import { articleDataNews, articleDataPersian } from '../Article/fixtureData';
import { shouldShallowMatchSnapshot } from '../../helpers/tests/testHelpers';
import services from '../../lib/config/services/index';
import { PlatformContextProvider } from '../../contexts/PlatformContext';

const MetadataWithContextAsObject = (service, serviceFixtureData, platform) => {
  const { metadata, promo } = serviceFixtureData;

  renderer.create(
    <ServiceContextProvider service={service}>
      <PlatformContextProvider platform={platform}>
        <MetadataContainer
          metadata={metadata}
          promo={promo}
          service={service}
        />
      </PlatformContextProvider>
    </ServiceContextProvider>,
  );

  return Helmet.peek();
};

describe('no data', () => {
  shouldShallowMatchSnapshot(
    'should render null',
    <MetadataContainer metadata={{}} promo={{}} service="" />,
  );
});

const metaTagsBuilder = (serviceConfig, description, seoTitle, id, things) => {
  const metaTags = [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, minimum-scale=1',
    },
    {
      name: 'article:author',
      content: serviceConfig.articleAuthor,
    },
    {
      name: 'article:modified_time',
      content: '2018-01-01T13:00:00.000Z',
    },
    {
      name: 'article:published_time',
      content: '2018-01-01T12:01:00.000Z',
    },
    { name: 'description', content: description },
    { name: 'fb:admins', content: 100004154058350 },
    { name: 'fb:app_id', content: 1609039196070050 },
    { name: 'og:description', content: description },
    {
      name: 'og:image',
      content: serviceConfig.defaultImage,
    },
    { name: 'og:image:alt', content: serviceConfig.brandName },
    { name: 'og:locale', content: serviceConfig.locale },
    { name: 'og:site_name', content: serviceConfig.brandName },
    { name: 'og:title', content: seoTitle },
    { name: 'og:type', content: 'article' },
    {
      name: 'og:url',
      content: `https://www.bbc.com/${serviceConfig.service}/articles/${id}`,
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: serviceConfig.twitterCreator },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image:alt', content: serviceConfig.brandName },
    {
      name: 'twitter:image:src',
      content: serviceConfig.defaultImage,
    },
    { name: 'twitter:site', content: serviceConfig.twitterSite },
    { name: 'twitter:title', content: seoTitle },
  ];

  // if the a thing meta tag needs to be injected, inject it before the tag with the name 'description'
  if (Array.isArray(things)) {
    things.forEach(thing => {
      const index = metaTags.findIndex(
        metaTag => metaTag.name === 'description',
      );
      metaTags.splice(index, 0, thing);
    });
  }

  return metaTags;
};

const articleMetadataBuilder = (
  serviceName,
  lang,
  title,
  description,
  id,
  seoTitle,
  things,
) => {
  const serviceConfig = services[serviceName];

  return {
    htmlAttributes: { lang },
    linkTags: [
      {
        rel: 'canonical',
        href: `https://www.bbc.com/${serviceConfig.service}/articles/${id}`,
      },
    ],
    metaTags: metaTagsBuilder(serviceConfig, description, seoTitle, id, things),
    title: [seoTitle, ' - ', serviceConfig.brandName],
  };
};

const doesMatch = (result, fixture) => {
  Object.keys(fixture).forEach(key => {
    expect(result[key]).toEqual(fixture[key]);
  });
};

describe('Successfully passes data to the Metadata component via React context', () => {
  it('should pass persian data to the Metadata component', () => {
    const result = MetadataWithContextAsObject(
      'persian',
      articleDataPersian,
      'canonical',
    );
    const expected = articleMetadataBuilder(
      'persian',
      'fa',
      'سرصفحه مقاله',
      'خلاصه مقاله',
      'cwv2xv848j5o',
      'سرصفحه مقاله',
      [],
    );

    doesMatch(result, expected);
  });

  it('it should pass news data to the Metadata component', () => {
    const result = MetadataWithContextAsObject(
      'news',
      articleDataNews,
      'canonical',
    );
    const expected = articleMetadataBuilder(
      'news',
      'en-gb',
      'Article Headline',
      'Article summary.',
      'c0000000001o',
      'Article Headline for SEO',
      [
        {
          name: 'article:tag',
          content: 'Royal Wedding 2018',
        },
        {
          name: 'article:tag',
          content: 'Queen Victoria',
        },
      ],
    );

    doesMatch(result, expected);
  });

  it('should add amp to HTML attributes when platform is set to AMP', () => {
    const result = MetadataWithContextAsObject('news', articleDataNews, 'amp');
    expect(result.htmlAttributes.amp).not.toBe(undefined);
  });
});
