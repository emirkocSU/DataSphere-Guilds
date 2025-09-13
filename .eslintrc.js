/**
 * ESLint Configuration for DataSphere Guilds
 * 
 * Professional-grade linting setup for Expo/React Native/TypeScript project
 * Includes comprehensive rules for:
 * - Code quality & consistency
 * - Security best practices
 * - Performance optimizations
 * - Accessibility standards
 * - React Native specific patterns
 * - TypeScript strict mode
 * 
 * @version 2.0.0
 */

module.exports = {
  root: true,
  
  // Parser Configuration
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: true,
  },
  
  // Environments
  env: {
    browser: true,
    node: true,
    es2023: true,
    jest: true,
    'react-native/react-native': true,
  },
  
  // Plugins
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'react-hooks',
    'import',
    'jsx-a11y',
    'prettier',
    'security',
    'unicorn',
    'promise',
    'sonarjs',
    'jest',
    'testing-library',
  ],
  
  // Extended Configurations
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:security/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:prettier/recommended', // Must be last
  ],
  
  // Settings
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/core-modules': [],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
  },
  
  // Global Rules
  rules: {
    /* ===========================================
     * Core ESLint Rules
     * =========================================== */
    'no-console': ['error', { 
      allow: ['warn', 'error', 'info'] 
    }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-await-in-loop': 'error',
    'no-return-await': 'error',
    'no-unused-vars': 'off', // Handled by TypeScript
    'no-empty-function': 'off',
    'no-underscore-dangle': ['error', {
      allow: ['_id', '__typename', '__DEV__'],
      allowAfterThis: false,
      allowAfterSuper: false,
      enforceInMethodNames: true,
    }],
    'no-shadow': 'off', // Handled by TypeScript
    'no-use-before-define': 'off', // Handled by TypeScript
    'max-len': ['error', {
      code: 100,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'max-lines': ['warn', {
      max: 300,
      skipBlankLines: true,
      skipComments: true,
    }],
    'max-lines-per-function': ['warn', {
      max: 50,
      skipBlankLines: true,
      skipComments: true,
      IIFEs: true,
    }],
    'complexity': ['warn', 10],
    'curly': ['error', 'all'],
    'dot-notation': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-invalid-this': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': ['warn', {
      ignore: [-1, 0, 1, 2, 100, 1000],
      ignoreArrayIndexes: true,
      enforceConst: true,
      detectObjects: false,
    }],
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['state', 'draft', 'acc', 'accumulator'],
    }],
    'no-proto': 'error',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-return-assign': ['error', 'always'],
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'radix': 'error',
    'require-await': 'error',
    'vars-on-top': 'error',
    'wrap-iife': ['error', 'outside'],
    'yoda': 'error',
    
    /* ===========================================
     * TypeScript Rules
     * =========================================== */
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
      allowConciseArrowFunctionExpressionsStartingWithVoid: false,
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      disallowTypeAnnotations: true,
    }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/member-ordering': ['error', {
      default: [
        // Type literals
        'signature',
        'call-signature',
        
        // Fields
        'public-static-field',
        'protected-static-field',
        'private-static-field',
        '#private-static-field',
        
        'public-decorated-field',
        'protected-decorated-field',
        'private-decorated-field',
        
        'public-instance-field',
        'protected-instance-field',
        'private-instance-field',
        '#private-instance-field',
        
        'public-abstract-field',
        'protected-abstract-field',
        
        // Constructors
        'public-constructor',
        'protected-constructor',
        'private-constructor',
        
        // Methods
        'public-static-method',
        'protected-static-method',
        'private-static-method',
        '#private-static-method',
        
        'public-decorated-method',
        'protected-decorated-method',
        'private-decorated-method',
        
        'public-instance-method',
        'protected-instance-method',
        'private-instance-method',
        '#private-instance-method',
        
        'public-abstract-method',
        'protected-abstract-method',
      ],
    }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'property',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/require-array-sort-compare': 'error',
    '@typescript-eslint/strict-boolean-expressions': ['error', {
      allowString: false,
      allowNumber: false,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false,
      allowAny: false,
    }],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-use-before-define': ['error', {
      functions: false,
      classes: true,
      variables: true,
      typedefs: true,
    }],
    
    /* ===========================================
     * React Rules
     * =========================================== */
    'react/jsx-filename-extension': ['error', {
      extensions: ['.tsx'],
    }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': ['error', {
      html: 'enforce',
      custom: 'enforce',
      explicitSpread: 'ignore',
      exceptions: ['Component'],
    }],
    'react/destructuring-assignment': ['error', 'always'],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/hook-use-state': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', {
      props: 'never',
      children: 'never',
    }],
    'react/jsx-handler-names': ['error', {
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
      checkLocalVariables: true,
      checkInlineFunction: true,
    }],
    'react/jsx-key': ['error', {
      checkFragmentShorthand: true,
      checkKeyMustBeforeSpread: true,
    }],
    'react/jsx-no-bind': ['error', {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
      ignoreDOMComponents: true,
    }],
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': ['error', {
      allowAllCaps: true,
      allowNamespace: false,
    }],
    'react/no-array-index-key': 'error',
    'react/no-danger': 'error',
    'react/no-unstable-nested-components': 'error',
    'react/self-closing-comp': 'error',
    'react/void-dom-elements-no-children': 'error',
    
    /* ===========================================
     * React Native Rules
     * =========================================== */
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': ['error', {
      skip: ['Text'],
    }],
    'react-native/no-single-element-style-arrays': 'error',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/sort-styles': ['error', 'asc'],
    
    /* ===========================================
     * React Hooks Rules
     * =========================================== */
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    
    /* ===========================================
     * Import Rules
     * =========================================== */
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: 'react',
          group: 'builtin',
          position: 'before',
        },
        {
          pattern: 'react-native',
          group: 'builtin',
          position: 'before',
        },
        {
          pattern: 'expo',
          group: 'builtin',
          position: 'before',
        },
        {
          pattern: 'expo-*',
          group: 'builtin',
          position: 'before',
        },
        {
          pattern: '@expo/**',
          group: 'builtin',
          position: 'before',
        },
        {
          pattern: '@react-navigation/**',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '@reduxjs/**',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '@{assets,components,contexts,hooks,i18n,models,navigation,screens,services,state,api,utils,types}/**',
          group: 'internal',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
      warnOnUnassignedImports: true,
    }],
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-relative-parent-imports': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/jest.setup.ts',
        '**/jest.config.js',
        '**/metro.config.js',
        '**/babel.config.js',
      ],
      optionalDependencies: false,
      peerDependencies: false,
    }],
    'import/no-mutable-exports': 'error',
    'import/no-commonjs': 'error',
    'import/first': 'error',
    'import/exports-last': 'error',
    'import/no-namespace': 'error',
    'import/newline-after-import': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-anonymous-default-export': 'error',
    
    /* ===========================================
     * Accessibility Rules
     * =========================================== */
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-is-valid': 'off', // Not relevant for React Native
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/no-access-key': 'error',
    
    /* ===========================================
     * Security Rules
     * =========================================== */
    'security/detect-object-injection': 'off', // Too many false positives
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    
    /* ===========================================
     * Unicorn Rules (Best Practices)
     * =========================================== */
    'unicorn/better-regex': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/consistent-destructuring': 'error',
    'unicorn/consistent-function-scoping': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/expiring-todo-comments': 'warn',
    'unicorn/explicit-length-check': 'error',
    'unicorn/filename-case': ['error', {
      cases: {
        camelCase: true,
        pascalCase: true,
      },
      ignore: [
        '^\\.',
        '^[A-Z]+\\.md$',
      ],
    }],
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-array-callback-reference': 'off', // Conflicts with React patterns
    'unicorn/no-array-for-each': 'error',
    'unicorn/no-array-push-push': 'error',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-document-cookie': 'error',
    'unicorn/no-empty-file': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/no-lonely-if': 'error',
    'unicorn/no-nested-ternary': 'off', // Sometimes useful
    'unicorn/no-new-array': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-null': 'off', // React Native uses null
    'unicorn/no-object-as-default-parameter': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-static-only-class': 'error',
    'unicorn/no-thenable': 'error',
    'unicorn/no-this-assignment': 'error',
    'unicorn/no-unreadable-array-destructuring': 'error',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/no-unused-properties': 'warn',
    'unicorn/no-useless-fallback-in-spread': 'error',
    'unicorn/no-useless-length-check': 'error',
    'unicorn/no-useless-promise-resolve-reject': 'error',
    'unicorn/no-useless-spread': 'error',
    'unicorn/no-useless-undefined': 'error',
    'unicorn/no-zero-fractions': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/numeric-separators-style': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-at': 'error',
    'unicorn/prefer-code-point': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-default-parameters': 'error',
    'unicorn/prefer-export-from': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-json-parse-buffer': 'error',
    'unicorn/prefer-logical-operator-over-ternary': 'error',
    'unicorn/prefer-modern-dom-apis': 'error',
    'unicorn/prefer-modern-math-apis': 'error',
    'unicorn/prefer-module': 'off', // React Native doesn't support ES modules
    'unicorn/prefer-native-coercion-functions': 'error',
    'unicorn/prefer-negative-index': 'error',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-object-from-entries': 'error',
    'unicorn/prefer-object-has-own': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/prefer-prototype-methods': 'error',
    'unicorn/prefer-query-selector': 'error',
    'unicorn/prefer-reflect-apply': 'error',
    'unicorn/prefer-regexp-test': 'error',
    'unicorn/prefer-set-has': 'error',
    'unicorn/prefer-spread': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/prefer-switch': 'error',
    'unicorn/prefer-ternary': 'error',
    'unicorn/prefer-top-level-await': 'off', // Not supported in React Native
    'unicorn/prefer-type-error': 'error',
    'unicorn/prevent-abbreviations': 'off', // Too restrictive
    'unicorn/relative-url-style': 'error',
    'unicorn/require-array-join-separator': 'error',
    'unicorn/require-number-to-fixed-digits-argument': 'error',
    'unicorn/require-post-message-target-origin': 'error',
    'unicorn/string-content': 'error',
    'unicorn/switch-case-braces': 'error',
    'unicorn/template-indent': 'error',
    'unicorn/text-encoding-identifier-case': 'error',
    'unicorn/throw-new-error': 'error',
    
    /* ===========================================
     * Promise Rules
     * =========================================== */
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'warn',
    'promise/avoid-new': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    'promise/valid-params': 'error',
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',
    
    /* ===========================================
     * SonarJS Rules (Code Quality)
     * =========================================== */
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/max-switch-cases': ['error', 10],
    'sonarjs/no-all-duplicated-branches': 'error',
    'sonarjs/no-collapsible-if': 'error',
    'sonarjs/no-collection-size-mischeck': 'error',
    'sonarjs/no-duplicate-string': ['error', 3],
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-element-overwrite': 'error',
    'sonarjs/no-empty-collection': 'error',
    'sonarjs/no-extra-arguments': 'error',
    'sonarjs/no-identical-conditions': 'error',
    'sonarjs/no-identical-expressions': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-ignored-return': 'error',
    'sonarjs/no-inverted-boolean-check': 'error',
    'sonarjs/no-nested-switch': 'error',
    'sonarjs/no-nested-template-literals': 'error',
    'sonarjs/no-one-iteration-loop': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/no-redundant-jump': 'error',
    'sonarjs/no-same-line-conditional': 'error',
    'sonarjs/no-small-switch': 'error',
    'sonarjs/no-unused-collection': 'error',
    'sonarjs/no-use-of-empty-return-value': 'error',
    'sonarjs/no-useless-catch': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/prefer-object-literal': 'error',
    'sonarjs/prefer-single-boolean-return': 'error',
    'sonarjs/prefer-while': 'error',
    
    /* ===========================================
     * Prettier Rules
     * =========================================== */
    'prettier/prettier': ['error', {
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      jsxSingleQuote: false,
      trailingComma: 'all',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'always',
      endOfLine: 'auto',
      proseWrap: 'preserve',
      htmlWhitespaceSensitivity: 'css',
      embeddedLanguageFormatting: 'auto',
    }],
  },
  
  // Overrides for specific file patterns
  overrides: [
    // TypeScript files
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // Allow TypeScript to handle these
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        'no-use-before-define': 'off',
      },
    },
    
    // Test files
    {
      files: [
        '**/__tests__/**/*.{ts,tsx}',
        '**/__mocks__/**/*.{ts,tsx}',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:testing-library/react',
      ],
      env: {
        jest: true,
        'jest/globals': true,
      },
      rules: {
        // Relax rules for tests
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'max-len': 'off',
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'no-magic-numbers': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-identical-functions': 'off',
        'unicorn/no-null': 'off',
        'import/no-extraneous-dependencies': 'off',
        
        // Enforce test best practices
        'jest/consistent-test-it': ['error', { fn: 'it' }],
        'jest/expect-expect': 'error',
        'jest/no-alias-methods': 'error',
        'jest/no-commented-out-tests': 'error',
        'jest/no-conditional-expect': 'error',
        'jest/no-deprecated-functions': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-done-callback': 'error',
        'jest/no-duplicate-hooks': 'error',
        'jest/no-export': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-interpolation-in-snapshots': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-large-snapshots': ['warn', { maxSize: 50 }],
        'jest/no-mocks-import': 'error',
        'jest/no-restricted-matchers': 'error',
        'jest/no-standalone-expect': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/no-test-return-statement': 'error',
        'jest/prefer-called-with': 'error',
        'jest/prefer-expect-assertions': 'off',
        'jest/prefer-hooks-on-top': 'error',
        'jest/prefer-lowercase-title': 'error',
        'jest/prefer-spy-on': 'error',
        'jest/prefer-strict-equal': 'error',
        'jest/prefer-to-be': 'error',
        'jest/prefer-to-contain': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/prefer-todo': 'error',
        'jest/require-hook': 'error',
        'jest/require-to-throw-message': 'error',
        'jest/require-top-level-describe': 'error',
        'jest/valid-describe-callback': 'error',
        'jest/valid-expect': 'error',
        'jest/valid-expect-in-promise': 'error',
        'jest/valid-title': 'error',
        
        // Testing Library rules
        'testing-library/await-async-query': 'error',
        'testing-library/await-async-utils': 'error',
        'testing-library/no-await-sync-query': 'error',
        'testing-library/no-container': 'error',
        'testing-library/no-debugging-utils': 'warn',
        'testing-library/no-dom-import': 'error',
        'testing-library/no-node-access': 'error',
        'testing-library/no-promise-in-fire-event': 'error',
        'testing-library/no-render-in-setup': 'error',
        'testing-library/no-unnecessary-act': 'error',
        'testing-library/no-wait-for-empty-callback': 'error',
        'testing-library/no-wait-for-multiple-assertions': 'error',
        'testing-library/no-wait-for-side-effects': 'error',
        'testing-library/no-wait-for-snapshot': 'error',
        'testing-library/prefer-find-by': 'error',
        'testing-library/prefer-presence-queries': 'error',
        'testing-library/prefer-query-by-disappearance': 'error',
        'testing-library/prefer-screen-queries': 'error',
        'testing-library/prefer-user-event': 'error',
        'testing-library/prefer-wait-for': 'error',
        'testing-library/render-result-naming-convention': 'error',
      },
    },
    
    // Configuration files
    {
      files: [
        '*.config.js',
        '*.config.ts',
        '.eslintrc.js',
        'babel.config.js',
        'metro.config.js',
        'jest.config.js',
      ],
      env: {
        node: true,
      },
      rules: {
        'import/no-commonjs': 'off',
        'import/no-extraneous-dependencies': 'off',
        'unicorn/prefer-module': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    
    // Entry files
    {
      files: ['App.tsx', 'index.tsx', 'src/index.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
    
    // React Navigation screens
    {
      files: ['src/screens/**/*.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
      },
    },
    
    // Redux slices
    {
      files: ['src/state/*.ts'],
      rules: {
        'no-param-reassign': 'off', // Redux Toolkit uses Immer
      },
    },
    
    // Migration files or legacy code
    {
      files: ['**/*.legacy.{js,ts,tsx}', '**/legacy/**'],
      rules: {
        // Disable most rules for legacy code
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'max-len': 'off',
        'max-lines': 'off',
        'complexity': 'off',
      },
    },
  ],
  
  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    'build/',
    '.expo/',
    '.expo-shared/',
    'web-build/',
    'ios/',
    'android/',
    '*.min.js',
    '*.bundle.js',
    '**/*.d.ts',
    'metro.config.js',
    'babel.config.js',
  ],
};
  