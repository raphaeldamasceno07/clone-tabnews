function status(request, response) {
  console.log(response.headers);
  response.status(200).json({ status: "são os melhores" });
}

export default status;
