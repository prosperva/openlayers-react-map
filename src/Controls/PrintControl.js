import MapContext from "../Map/MapContext";
import PrintDialog from "ol-ext/control/PrintDialog";
import "ol-ext/dist/ol-ext.css";
import jsPDF from "jspdf";
import { saveAs } from "save-as";
import { useContext, useEffect } from "react";

import CanvasAttribution from "ol-ext/control/CanvasAttribution";
import CanvasTitle from "ol-ext/control/CanvasTitle";
import "./print.css";

const PrintControl = () => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    let print = new PrintDialog({});
    map.controls.push(print);

    let attr = new CanvasAttribution({
      label: "Awesome attribution",
      collapsed: true,
      collapsible: false,
    });
    map.controls.push(attr);

    let title = new CanvasTitle({});
    title.setTitle("Map Title");
    title.setVisible(true);
    map.controls.push(title);

    print.on(["print", "error"], function (e) {
      if (e.image) {
        if (e.pdf) {
          // Export pdf using the print info
          var pdf = new jsPDF({
            orientation: e.print.orientation,
            unit: e.print.unit,
            format: e.print.size,
          });
          pdf.addImage(
            e.image,
            "JPEG",
            e.print.position[0],
            e.print.position[0],
            e.print.imageWidth,
            e.print.imageHeight
          );
          pdf.save(e.print.legend ? "legend.pdf" : "map.pdf");
        } else {
          // Save image as file
          e.canvas.toBlob(
            function (blob) {
              var name =
                (e.print.legend ? "legend." : "map.") +
                e.imageType.replace("image/", "");
              saveAs(blob, name);
            },
            e.imageType,
            e.quality
          );
        }
      } else {
        console.warn("No canvas to export");
      }
    });

    return () => map.controls.remove(print);
  }, [map]);
  return null;
};

export default PrintControl;
