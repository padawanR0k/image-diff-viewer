import {useState, useEffect, useRef} from "react";

import resemble from 'resemblejs'
import {getSmallSize, isDifferentSize, resizeImage} from "./utils/resize";


function App() {
  const imgRef1 = useRef<HTMLImageElement | null>(null);
  const imgRef2 = useRef<HTMLImageElement | null>(null);
  const boxRef1 = useRef<HTMLTextAreaElement | null>(null);
  const boxRef2 = useRef<HTMLTextAreaElement | null>(null);

  const [resultImg, setResultImg] = useState<string>('');

  const blobs = useRef<{ [key: string]: any }>({});

  const getCompareResult = (img1: string | ImageData | Buffer, img2:  string | ImageData | Buffer) => {
    return new Promise((resolve, reject) => {
      try {
        resemble(img1)
          .compareTo(img2)
          .onComplete((data) => {
            const url = data.getImageDataUrl();
            resolve(url);
          })
      } catch(e) {
        console.error(e)
        return null;
      }
    });
  }

  const isEmpty = (src: string) => {
    return  !src || src === location.href;
  }

  const copyEventCallback = ($img: HTMLImageElement | null, key: number) => async (evt: ClipboardEvent) => {
    if (!$img) return

    const clipboardItems = evt.clipboardData?.items;
    const items = [].slice.call(clipboardItems).filter((item: any) => {
      return item?.type?.indexOf('image') !== -1;
    });

    if (items.length === 0) {
      return;
    }

    const item = items[0] as any;
    const blob = item.getAsFile();

    $img.src = URL.createObjectURL(blob);
    blobs.current[key] = blob;

    $img.onload = async () => {
      if (!isEmpty(imgRef2.current!.src) && !isEmpty(imgRef1.current!.src)) {
        let a: any = imgRef1.current!.src;
        let b: any = imgRef2.current!.src;

        if (isDifferentSize(imgRef1!.current!, imgRef2.current!)) {
          const size = getSmallSize(imgRef1.current!, imgRef2.current!)

          a = await resizeImage(blobs.current[1], size.width, size.height) || ''
          b = await resizeImage(blobs.current[2], size.width, size.height) || ''
        }

        const result = await getCompareResult(a, b) as string;
        setResultImg(result || 'https://http.cat/400');
      }
    }
  }

  useEffect(() => {
    boxRef1.current!.addEventListener('paste', copyEventCallback(imgRef1.current, 1));
    boxRef2.current!.addEventListener('paste', copyEventCallback(imgRef2.current, 2));
    return () => {
      boxRef1.current!.removeEventListener('paste', copyEventCallback(imgRef1.current, 1));
      boxRef2.current!.removeEventListener('paste', copyEventCallback(imgRef2.current, 2));
    }
  }, [])

  return (
    <div className="App">
      <main>
        <p className="describe" >이미지 복사후 양쪽의 textarea에 붙여넣기를 하면, 두 이미지의 차이를 시각화하여 보여줍니다.</p>
        <section className="paste-area">
          <textarea ref={boxRef1} className="box left" contentEditable={true} suppressContentEditableWarning={true} />
          <textarea ref={boxRef2} className="box right" contentEditable={true} suppressContentEditableWarning={true} />
        </section>
        <section className="img-area">
          <div className="img-container">
            <img ref={imgRef1} src="" alt=""/>
          </div>
          <div className="img-container">
            <img src={resultImg} alt="" className="result"/>
          </div>
          <div className="img-container">
            <img ref={imgRef2} src="" alt=""/>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
