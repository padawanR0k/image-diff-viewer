import { Header } from 'components/Header';
import { Button } from 'components/Button';
import { ReactComponent as Logo } from 'assets/favicon.svg';
import {useEffect, useRef} from "react";

import resemble from 'resemblejs'

function App() {
  const imgRef1 = useRef<HTMLImageElement>(null);
  const imgRef2 = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compare = (img1: string | ImageData | Buffer, img2:  string | ImageData | Buffer) => {
    console.log(img1, img2)
    resemble(img1)
      .compareTo(img2)
      .setReturnEarlyThreshold(8)
      .onComplete((data) => {
        /* do something */
        console.log(data)

      });
  }

  const isEmpty = (src: string) => src === 'http://localhost:3000/';
  const event = () => {
    // Handle the `paste` event
    document.addEventListener('paste', function (evt) {
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
      // Get the blob of image
      const blob = item.getAsFile();
      if (imgRef1.current && imgRef2.current) {
        if (isEmpty(imgRef1.current.src)) {
          imgRef1.current.src = URL.createObjectURL(blob);
          console.log(imgRef1.current.src)
          return;
        } else if (isEmpty(imgRef2.current.src)) {
          imgRef2.current.src = URL.createObjectURL(blob);
          console.log('?')
          return;
        }
        // if (canvasRef.current) {
        // }
        if (!isEmpty(imgRef2.current.src) && !isEmpty(imgRef1.current.src)) {
          compare(imgRef1.current.src, imgRef2.current.src)
        }
      }
    });
  }
  useEffect(() => {

    event()
  }, [])
  return (
    <div className="App">
      <Header title="hola" />
      <img ref={imgRef1} src="" alt=""/>
      <img ref={imgRef2} src="" alt=""/>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
