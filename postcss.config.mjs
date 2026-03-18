import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import postcssNormalize from 'postcss-normalize';

export default {
  plugins: [
    postcssFlexbugsFixes,
    postcssPresetEnv({
      stage: 0,
      //uncomment the following if you want to prefix grid properties
      // autoprefixer: { grid: true },
    }),
    // Adds PostCSS Normalize as the reset css with default options,
    // so that it honors browserslist config in package.json
    // which in turn let's users customize the target behavior as per their needs.
    postcssNormalize,
  ],
};
