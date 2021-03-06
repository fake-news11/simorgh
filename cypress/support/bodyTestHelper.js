import { BBC_BLOCKS } from '@bbc/psammead-assets/svgs';

export const getElement = element => cy.get(element);

export const getSecondElement = element => cy.get(element).eq(1);

export const shouldContainText = (element, text) => {
  element.should('contain', text);
};

export const shouldContainStyles = (element, css, styling) => {
  element.should(el => {
    expect(el).to.have.css(css, styling);
  });
};

export const checkElementStyles = (elementString, text, color, fontFamily) => {
  const el = getElement(elementString);
  shouldContainText(el, text);
  shouldContainStyles(el, 'color', color);
  shouldContainStyles(el, 'font-family', fontFamily);
};

export const getBlockData = (blockType, win) => {
  let blockData;
  const { blocks } = win.SIMORGH_DATA.data.content.model;

  blocks.forEach(block => {
    if (!blockData && block.type === blockType) {
      blockData = block;
    }
  });
  return blockData;
};

export const firstHeadlineDataWindow = () => {
  cy.window().then(win => {
    const headlineData = getBlockData('headline', win);
    const { text } = headlineData.model.blocks[0].model.blocks[0].model;
    checkElementStyles(
      'h1',
      text,
      'rgb(34, 34, 34)',
      'ReithSerifNewsMedium, Helvetica, Arial, sans-serif',
    );
  });
};

export const firstSubheadlineDataWindow = () => {
  cy.window().then(win => {
    const subheadingData = getBlockData('subheadline', win);
    const { text } = subheadingData.model.blocks[0].model.blocks[0].model;

    checkElementStyles(
      'h2',
      text,
      'rgb(64, 64, 64)',
      'ReithSansNewsRegular, Helvetica, Arial, sans-serif',
    );
  });
};

export const firstParagraphDataWindow = () => {
  cy.window().then(win => {
    const paragraphData = getBlockData('text', win);
    const { text } = paragraphData.model.blocks[0].model;
    const paragraphExample = getElement('p');

    shouldContainText(paragraphExample, text);
  });
};

export const copyrightDataWindow = () => {
  cy.window().then(win => {
    const copyrightData = getBlockData('image', win);
    const { copyrightHolder } = copyrightData.model.blocks[0].model;
    const copyrightLabel = getElement('figure p').eq(0);
    copyrightLabel.should('contain', copyrightHolder);
    shouldContainStyles(
      copyrightLabel,
      'background-color',
      'rgba(34, 34, 34, 0.75)',
    );
    shouldContainStyles(copyrightLabel, 'color', 'rgb(255, 255, 255)');
  });
};

export const checkFooterLinks = (position, url) => {
  cy.get('a')
    .eq(position)
    .should('have.attr', 'href')
    .and('contain', url);
};

export const checkLinkStyling = position => {
  const link = cy.get('a').eq(position);
  shouldContainStyles(link, 'color', 'rgb(255, 255, 255)');
  link.focus();
  const linkSpan = link.get('span').eq(position);
  shouldContainStyles(
    linkSpan,
    'border-bottom',
    '2px solid rgb(255, 255, 255)',
  );
  link.invoke('mouseover');
  shouldContainStyles(
    linkSpan,
    'border-bottom',
    '2px solid rgb(255, 255, 255)',
  );
};

export const clickInlineLinkAndTestPageHasHTML = (link, url) => {
  getElement(link).click();
  cy.url().should('contain', url);
  const anchorElement = getElement('header a');
  shouldContainText(anchorElement, 'BBC News');
};

export const renderedTitle = title => {
  cy.title().should('eq', title);
};

export const placeholderImageLoaded = placeholderImage => {
  shouldContainStyles(
    placeholderImage,
    'background-color',
    'rgb(236, 234, 231)',
  );
  shouldContainStyles(
    placeholderImage,
    'background-image',
    `url("data:image/svg+xml;base64,${BBC_BLOCKS}")`,
  );
};

export const figureVisibility = figure => {
  figure.should('be.visible');
  figure.should('to.have.descendants', 'img');
};

export const visibleImageNoCaption = figure => {
  figureVisibility(figure);
  figure.should('not.to.have.descendants', 'figcaption');
};

export const visibleImageWithCaption = figure => {
  figureVisibility(figure);
  figure.should('to.have.descendants', 'figcaption');
};
