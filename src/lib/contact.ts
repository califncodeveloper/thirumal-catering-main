export const CONTACT = {
  brand: "Thirumal Catering",
  tagline: "Tradition in Every Taste",
  phone: "+91 81898 73332",
  phoneRaw: "+918189873332",
  whatsappNumber: "918189873332",
  email: "info@thirumalcatering.com",
  address:
    "72/3, 4th Cross St, Ranganathapuram West, Tambaram, Chennai - 600045",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "72/3 4th Cross St Ranganathapuram West Tambaram Chennai 600045",
    ),
  mapsEmbed:
    "https://www.google.com/maps?q=" +
    encodeURIComponent(
      "72/3 4th Cross St Ranganathapuram West Tambaram Chennai 600045",
    ) +
    "&output=embed",
};

export const waLink = (text?: string) =>
  `https://wa.me/${CONTACT.whatsappNumber}${
    text ? `?text=${encodeURIComponent(text)}` : ""
  }`;
