import 'isomorphic-fetch';

const getInitialData = async ({ match }) => {
  try {
    const { id, service } = match.params;

    const url = `${process.env.SIMORGH_BASE_URL}/${service}/${id}.json`;

    const response = await fetch(url);

    const data = await response.json();

    return {
      data,
      service,
    };
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
    return {};
  }
};

export default getInitialData;
