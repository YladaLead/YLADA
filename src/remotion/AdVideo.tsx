import { Composition } from 'remotion'
import { AdComposition } from './AdComposition'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AdVideo"
        component={AdComposition}
        durationInFrames={900} // 30s a 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          clips: [],
          script: null,
        }}
      />
    </>
  )
}

