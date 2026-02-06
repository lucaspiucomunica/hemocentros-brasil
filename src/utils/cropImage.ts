/**
 * Carrega uma imagem a partir de uma URL (object URL ou data URL).
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = url;
  });
}

export type CropAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Gera um Blob da região recortada da imagem.
 * @param imageSrc - URL da imagem (object URL ou data URL)
 * @param pixelCrop - Área a recortar em pixels (ex.: retorno de onCropComplete do react-easy-crop)
 * @param mimeType - Tipo do arquivo de saída (default: image/png)
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropAreaPixels,
  mimeType: string = "image/png"
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Contexto 2d não disponível");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Falha ao gerar imagem recortada"));
      },
      mimeType,
      0.95
    );
  });
}
