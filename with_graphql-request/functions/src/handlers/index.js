module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Leave-tracker",
        input: event,
      },
      null,
      2
    ),
  };
};
