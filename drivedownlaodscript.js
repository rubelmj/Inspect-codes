
(async () => {
  // 1. Load browser-compatible jsPDF (UMD build)
  async function loadJsPDF() {
    if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const url =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

      try {
        if (window.trustedTypes) {
          let policy;
          try {
            policy = window.trustedTypes.createPolicy(
              "jspdfLoaderPolicy",
              { createScriptURL: value => value }
            );
          } catch (e) {
            console.warn("Trusted Types policy unavailable:", e.message);
          }

          script.src = policy ? policy.createScriptURL(url) : url;
        } else {
          script.src = url;
        }
      } catch (e) {
        reject(e);
        return;
      }

      script.onload = resolve;
      script.onerror = () => reject(
        new Error("Could not load jsPDF. Check CDN or browser policy.")
      );

      document.head.appendChild(script);
    });

    if (!window.jspdf?.jsPDF) {
      throw new Error("jsPDF loaded, but its constructor was not found.");
    }

    return window.jspdf.jsPDF;
  }

  try {
    const jsPDF = await loadJsPDF();

    // 2. Collect rendered Drive page images
    const images = Array.from(document.images)
      .filter(img =>
        img.src.startsWith("blob:") &&
        img.complete &&
        img.naturalWidth > 0 &&
        img.naturalHeight > 0
      )
      .sort((a, b) => {
        const A = a.getBoundingClientRect();
        const B = b.getBoundingClientRect();
        return A.top - B.top || A.left - B.left;
      });

    console.log(`Found ${images.length} rendered images.`);

    if (!images.length) {
      throw new Error("No rendered page images found.");
    }

    // 3. Convert each image into a PDF page
    let pdf = null;
    let processed = 0;

    for (const img of images) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const data = canvas.toDataURL("image/jpeg", 0.98);
      const w = canvas.width;
      const h = canvas.height;
      const orientation = w > h ? "landscape" : "portrait";

      if (!pdf) {
        pdf = new jsPDF({
          orientation,
          unit: "px",
          format: [w, h],
          compress: true
        });
      } else {
        pdf.addPage([w, h], orientation);
      }

      pdf.addImage(data, "JPEG", 0, 0, w, h);
      processed++;
      console.log(`Added page image ${processed}/${images.length}`);
    }

    pdf.save("download.pdf");
    console.log(`PDF created from ${processed} rendered images.`);
  } catch (error) {
    console.error("PDF export failed:", error);
  }
})();
