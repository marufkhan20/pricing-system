import axios from "axios";
import ExcelJS from "exceljs";

const generateOrderFile = async (products) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet
  const worksheet = workbook.addWorksheet("My Sheet");

  // Add data to the worksheet
  worksheet.columns = [
    { header: "Image", key: "image", width: 50 },
    { header: "Description", key: "description", width: 30 },
    { header: "WC Code", key: "wcCode", width: 30 },
    { header: "Box Code", key: "boxCode", width: 30 },
    { header: "Pack", key: "pack", width: 30 },
    { header: "Unit", key: "unit", width: 30 },
    { header: "Case", key: "case", width: 30 },
    { header: "Ti", key: "ti", width: 30 },
    { header: "Hi", key: "hi", width: 30 },
    { header: "Case Per Pallet", key: "casePerPallet", width: 30 },
    { header: "UPC", key: "upc", width: 30 },
    { header: "Freight Per Unit", key: "freightPerUnit", width: 30 },
    { header: "Freight Per Case", key: "freightPerCase", width: 30 },
    { header: "Commission 1 Per Unit", key: "commission1PerUnit", width: 30 },
    { header: "Commission 1 Per Case", key: "commission1PerCase", width: 30 },
    { header: "Commission 2 Per Unit", key: "commission2PerUnit", width: 30 },
    { header: "Commission 2 Per Case", key: "commission2PerCase", width: 30 },
    { header: "Mark Up Unit", key: "markUpUnit", width: 30 },
    { header: "Mark Up Case", key: "markUpCase", width: 30 },
  ];

  for (let i = 0; i < products.length; i++) {
    // console.log("product image", products[i]?.image);
    // if (products[i]?.image) {
    //   const imagePath = products[i]?.image;
    //   const imageBuffer = await getImageBuffer(imagePath);
    //   const imageId = workbook.addImage({
    //     buffer: imageBuffer,
    //     extension: "jpeg",
    //   });

    //   worksheet.addImage(imageId, {
    //     tl: { col: 0, row: i + 2 },
    //     br: { col: 1, row: i + 3 },
    //     editAs: "undefined",
    //     // ext: {
    //     //   width: desiredWidth, // Set desired width
    //     //   height: desiredHeight,
    //     // },
    //   });
    // }

    worksheet.getCell(`A${i + 2}`).value = products[i]?.image;
    worksheet.getCell(`B${i + 2}`).value = products[i].description;
    worksheet.getCell(`C${i + 2}`).value = products[i].wcCode;
    worksheet.getCell(`D${i + 2}`).value = products[i].boxCode;
    worksheet.getCell(`E${i + 2}`).value = products[i].pack;
    worksheet.getCell(`F${i + 2}`).value = products[i].unit;
    worksheet.getCell(`G${i + 2}`).value = products[i].case;
    worksheet.getCell(`H${i + 2}`).value = products[i].ti;
    worksheet.getCell(`I${i + 2}`).value = products[i].hi;
    worksheet.getCell(`J${i + 2}`).value = products[i].casesPerPallet;
    worksheet.getCell(`K${i + 2}`).value = products[i].upc;
    worksheet.getCell(`L${i + 2}`).value = products[i].freightPerUnit;
    worksheet.getCell(`M${i + 2}`).value = products[i].freightPerCase;
    worksheet.getCell(`N${i + 2}`).value = products[i].commission1PerUnit;
    worksheet.getCell(`O${i + 2}`).value = products[i].commission1PerCase;
    worksheet.getCell(`P${i + 2}`).value = products[i].commission2PerUnit;
    worksheet.getCell(`Q${i + 2}`).value = products[i].commission2PerCase;
    worksheet.getCell(`R${i + 2}`).value = products[i].markUpUnit;
    worksheet.getCell(`S${i + 2}`).value = products[i].markUpCase;
  }

  const name = Date.now();

  // Save the workbook to a file
  workbook.xlsx
    .writeFile(`public/orders/${name}.xlsx`)
    .then(function () {
      console.log("Excel file generated and saved successfully.");
    })
    .catch(function (error) {
      console.error("Error generating Excel file:", error);
    });

  return {
    filename: name + ".xlsx",
    path: `/orders/${name}.xlsx`,
  };
};

// Function to convert image to base64 string
// const getImageBuffer = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// };

const getImageBuffer = async (filePath) => {
  try {
    const response = await axios.get(filePath, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data, "binary");
    return imageBuffer;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};

export default generateOrderFile;
