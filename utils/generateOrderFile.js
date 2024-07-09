import axios from "axios";
import ExcelJS from "exceljs";

const generateOrderFile = async (products) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet
  const worksheet = workbook.addWorksheet("My Sheet");

  // Add data to the worksheet
  worksheet.columns = [
    { header: "Tag 1", key: "tag1" },
    { header: "Tag 2", key: "tag2" },
    { header: "Image", key: "image" },
    { header: "Description", key: "description" },
    { header: "WC Code", key: "wcCode" },
    { header: "Box Code", key: "boxCode" },
    { header: "Pack", key: "pack" },
    { header: "Unit", key: "unit" },
    { header: "Case", key: "case" },
    { header: "Ti", key: "ti" },
    { header: "Hi", key: "hi" },
    { header: "Case Per Pallet", key: "casePerPallet" },
    { header: "UPC", key: "upc" },
    { header: "Freight Per Unit", key: "freightPerUnit" },
    { header: "Freight Per Case", key: "freightPerCase" },
    { header: "Commission 1 Per Unit", key: "commission1PerUnit" },
    { header: "Commission 1 Per Case", key: "commission1PerCase" },
    { header: "Commission 2 Per Unit", key: "commission2PerUnit" },
    { header: "Commission 2 Per Case", key: "commission2PerCase" },
    { header: "Mark Up Unit", key: "markUpUnit" },
    { header: "Mark Up Case", key: "markUpCase" },
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

    worksheet.getCell(`A${i + 2}`).value = products[i]?.tag1;
    worksheet.getCell(`B${i + 2}`).value = products[i].tag2;
    worksheet.getCell(`C${i + 2}`).value = {
      text: "View Image",
      hyperlink: products[i].image,
    };
    worksheet.getCell(`D${i + 2}`).value = products[i].description;
    worksheet.getCell(`E${i + 2}`).value = products[i].wcCode;
    worksheet.getCell(`F${i + 2}`).value = products[i].boxCode;
    worksheet.getCell(`G${i + 2}`).value = products[i].pack;
    worksheet.getCell(`H${i + 2}`).value = products[i].unit;
    worksheet.getCell(`I${i + 2}`).value = products[i].case;
    worksheet.getCell(`J${i + 2}`).value = products[i].ti;
    worksheet.getCell(`K${i + 2}`).value = products[i].hi;
    worksheet.getCell(`L${i + 2}`).value = products[i].casesPerPallet;
    worksheet.getCell(`M${i + 2}`).value = products[i].upc;
    worksheet.getCell(`N${i + 2}`).value = products[i].freightPerUnit;
    worksheet.getCell(`O${i + 2}`).value = products[i].freightPerCase;
    worksheet.getCell(`P${i + 2}`).value = products[i].commission1PerUnit;
    worksheet.getCell(`Q${i + 2}`).value = products[i].commission1PerCase;
    worksheet.getCell(`R${i + 2}`).value = products[i].commission2PerUnit;
    worksheet.getCell(`S${i + 2}`).value = products[i].commission2PerCase;
    worksheet.getCell(`T${i + 2}`).value = products[i].markUpUnit;
    worksheet.getCell(`U${i + 2}`).value = products[i].markUpCase;
  }

  // Calculate column widths based on content
  worksheet.columns.forEach((column, index) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const length = cell.value ? String(cell.value).length : 0;
      if (length > maxLength) {
        maxLength = length;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 3; // Set minimum width
  });

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
