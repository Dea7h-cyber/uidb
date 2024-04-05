
import React, { useCallback, useMemo, useState } from 'react';

const IMG_SVC_URL = 'https://images.svc.ui.com/';
const getSrcUrl = (
  hiresUrl: string,
  size: number,
  devicePixelRatio: '1x' | '2x',
  quality = 75,
) => {
  const url = new URL(IMG_SVC_URL);
  url.searchParams.set('u', hiresUrl);
  url.searchParams.set(
    'w', // TODO Store team support `h` for height as most of our UIs are bound by height
    (devicePixelRatio === '2x' ? size * 2 : size).toFixed(0),
  );
  url.searchParams.set('q', quality.toFixed(0));

  return url.toString();
};

const getSizeNumber = (size: UidbImageProps['size']) => {
  const sizeNumber =
    typeof size === 'number' ? size : parseInt(size.replace('px', ''), 10);
  return sizeNumber;
};

export type UidbImageProps = {
  /**
   * High resolution image to feed to the image service.
   * - receive it from BE
   * - use your own lookup table
   *   - see `getHiresUrlFromConsoleShortname` for inspiration
   * - use guid of unreleased products to fetch data from UIDB to construct hiresUrl
   *   - see `useHiresUrlFromUidbGuid` for inspiration
   */
  hiresUrl: string | undefined;

  /**
   * Numeric values list all the sizes in css pixels that are supported by image service
   * - image service has @2x sizes for all of these
   * - power of 2 sizes from 16 to 1024
   * - 24, 48, 96 as special cases from our design system
   * Use string literals with `px` suffix for custom css sizes - image service wil use the next largest size.
   */
  size:
    | 16
    | 32
    | 64
    | 128
    | 256
    | 512
    | 1024
    // | 2048 // not available at 2x size
    | 24
    | 48
    | 96
    | `${number}px`;

  /**
   * Quality for image optimization
   * @default 75
   */
  q?: number;

  /**
   * Image to try as a fallback if image service is not reachable.
   */
  srcFallbackOffline?: string | null;

  /**
   * Image to use as a fallback if image service is not reachable and `srcFallbackOffline` is not specified or not reachable.
   */
  srcFallbackBundled?: string | null;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'>;

export const UidbImage_WithKey: React.FC<UidbImageProps & { key: string }> = ({
  hiresUrl,
  size,
  srcFallbackOffline,
  srcFallbackBundled,
  q,
  ...restProps
}) => {
  const sizeNumber = getSizeNumber(size);
  const src1x = hiresUrl && getSrcUrl(hiresUrl, sizeNumber, '1x', q);
  const src2x = hiresUrl && getSrcUrl(hiresUrl, sizeNumber, '2x', q);

  const [fallbackType, setFallbackType] = useState<
    null | 'local' | 'bundled' | 'empty'
  >(null);
  const srcFallback =
    fallbackType === 'bundled'
      ? srcFallbackBundled
      : fallbackType === 'local'
      ? srcFallbackOffline
      : undefined;

  const srcSet = hiresUrl && [
    `${src1x} 1x`,
    `${src2x} 2x`,
    srcFallbackOffline && `${srcFallbackOffline} 2x`,
    srcFallbackBundled && `${srcFallbackBundled} 2x`,
  ].filter(src => !!src).join(', ');
  const src = srcFallback || src1x;

  const onError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.log('error', srcFallbackBundled, event);
      const img = event.currentTarget;
      if (fallbackType !== 'local' && srcFallbackOffline) {
        setFallbackType('local');
        img.srcset = srcFallbackOffline;
        img.src = srcFallbackOffline;
      } else if (fallbackType !== 'bundled' && srcFallbackBundled) {
        setFallbackType('bundled');
        img.srcset = srcFallbackBundled;
        img.src = srcFallbackBundled;
      } else if (fallbackType !== 'empty') {
        setFallbackType('empty');
      }
    },
    [fallbackType, srcFallbackBundled, srcFallbackOffline],
  );

  const onLoad = useMemo(() => {
    if (fallbackType === 'empty') {
      return () => {
        setFallbackType(null);
      };
    }
    return undefined;
  }, [fallbackType]);

  return (
    <img
      style={{
        objectFit: `contain`,
        aspectRatio: '1'
      }}
      width={sizeNumber}
      height={sizeNumber}
      srcSet={srcFallback || srcSet}
      src={src}
      data-fallback-type={fallbackType}
      onError={onError}
      onLoad={onLoad}
      alt='' //to be overwritten
      {...restProps}
    ></img>
  );
};

/**
 * Displays hiresUrl images from UIDB. Resized, optimized and cached by Image service.
 *
 * - backed by image hosting service that uses:
 *   - resizing of hi-res asset to limited set of sizes, with quality parameters - only done once per each output
 *   - optimized formats (webp, avif) based on what is supported by the requesting browser
 *   - aggressive HTTP caching of resized images
 *   - CDN
 * - context-aware treatment of sizes
 *   - uses square aspect ratio - exposes only one property `size`
 *   - exposes preferred and optimal numeric sizes
 *   - allows to use custom sizes using a string with `px` suffix
 *   - uses `size` for locking dimensions using `width` and `height` attributes
 *   - uses `srcset` to support `2x` retina resolution where possible
 *   - uses local fallback, if specified
 *   - uses bundled fallback if all other sourceSet entries fail
 *   - uses fallbacks already on srcSet - browser will not even try loading known broken images in the same session
 *
 * @see https://nextjs.org/docs/pages/api-reference/components/image for API inspiration
 */
const UidbImage: React.VFC<UidbImageProps> = (props) => {
  const key = `${props.hiresUrl}_${props.size}`;
  return <UidbImage_WithKey key={key} {...props} />;
};

export default UidbImage;

export const UidbImage_getSizeNumber = getSizeNumber;
export const UidbImage_getSrcUrl = getSrcUrl;
