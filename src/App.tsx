import {useState, useEffect, useRef} from "react";

import resemble from 'resemblejs'


function App() {
  const imgRef1 = useRef<HTMLImageElement | null>(null);
  const imgRef2 = useRef<HTMLImageElement | null>(null);
  const boxRef1 = useRef<HTMLTextAreaElement | null>(null);
  const boxRef2 = useRef<HTMLTextAreaElement | null>(null);

  const [resultImg, setResultImg] = useState<string>('');


  const getCompareResult = (img1: string | ImageData | Buffer, img2:  string | ImageData | Buffer) => {
    return new Promise((resolve, reject) => {
      try {
        resemble(img1)
          .compareTo(img2)
          // .setReturnEarlyThreshold(8)
          .onComplete((data) => {
            /* do something */
            const url = data.getImageDataUrl();
            resolve(url);
          })
      } catch(e) {
        console.error(e)
        return null;
      }
    });
  }

  const isEmpty = (src: string) => !src || src === 'http://localhost:3000/';

  const copyEventCallback = ($img: HTMLImageElement | null) => async (evt: ClipboardEvent) => {
    if (!$img) return
    // Get the data of clipboard
    const clipboardItems = evt.clipboardData?.items;
    const items = [].slice.call(clipboardItems).filter((item: any) => {
      // Filter the image items only
      return item?.type?.indexOf('image') !== -1;
    });
    if (items.length === 0) {
      return;
    }

    console.count()

    const item = items[0] as any;
    const blob = item.getAsFile();
    $img.src = URL.createObjectURL(blob);

    if (!isEmpty(imgRef2.current!.src) && !isEmpty(imgRef1.current!.src)) {
      const result = await getCompareResult(imgRef1.current!.src, imgRef2.current!.src) as string;
      setResultImg(result || 'https://http.cat/400');
    }
  }

  useEffect(() => {
    boxRef1.current!.addEventListener('paste', copyEventCallback(imgRef1.current));
    boxRef2.current!.addEventListener('paste', copyEventCallback(imgRef2.current));
    return () => {
      boxRef1.current!.removeEventListener('paste', copyEventCallback(imgRef1.current));
      boxRef2.current!.removeEventListener('paste', copyEventCallback(imgRef2.current));
    }
  }, [])

  return (
    <div className="App">
      <main>
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
