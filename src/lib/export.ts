import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { CarouselProject } from '@/types';

export async function exportSlideAsPng(slideElement: HTMLElement, filename: string) {
  const dataUrl = await toPng(slideElement, { quality: 1, pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function exportAllSlidesAsZip(
  slideElements: HTMLElement[],
  projectName: string
) {
  const zip = new JSZip();

  for (let i = 0; i < slideElements.length; i++) {
    const dataUrl = await toPng(slideElements[i], { quality: 1, pixelRatio: 2 });
    const base64 = dataUrl.split(',')[1];
    zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}-carrossel.zip`);
}

export async function exportAsPdf(
  slideElements: HTMLElement[],
  projectName: string
) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] });

  for (let i = 0; i < slideElements.length; i++) {
    if (i > 0) pdf.addPage([1080, 1080]);
    const dataUrl = await toPng(slideElements[i], { quality: 1, pixelRatio: 2 });
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1080);
  }

  pdf.save(`${projectName}-carrossel.pdf`);
}

export function copyCaption(project: CarouselProject) {
  const text = project.caption || '';
  const hashtags = project.hashtags?.join(' ') || '';
  navigator.clipboard.writeText(`${text}\n\n${hashtags}`);
}
