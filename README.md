# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

Make a video explaining the following. 

Your answers should be based on the guidelines listed below  (the video must be made with a laptop).

Self Introduction
1. Your name, profession, and relevant background information.
2. A brief overview of your skills, experience, and achievements.
3. A unique value proposition that sets you apart from others.

What do you know about our company and its mission?
1. Research-based information about the company's products/services, values, and mission.
2. How the company's mission aligns with your own values and goals.
3. Any notable achievements or awards the company has received.

What motivates you to work with our company?
1. How the company's mission and values resonate with you.
2. Opportunities you see for growth and development within the company.
3. Any personal connections or experiences that have led you to the company.

How do you see yourself contributing to our company's growth and success?
1. Specific skills or strengths you bring to the table.
2. Ideas for how you can apply your skills to drive growth and success.
3. Any relevant experience or achievements that demonstrate your ability to contribute.

What experience do you have in the role you are applying for?
1. Relevant work experience, including job titles, company names, and achievements.
2. Transferable skills that can be applied to the role.
3. Any relevant education, training, or certifications.

How would you approach specific task or project on the role you are applying for?
1. A clear understanding of the task or project requirements.
2. A step-by-step approach to completing the task or project.
3. Any relevant tools, software, or methodologies you would use.

What measures would you propose to improve process or solve problem for the company?
1. A clear understanding of the process or problem at hand.
2. A well-thought-out proposal for improvement or solution.
3. Any data or research that supports your proposal.

Can you walk us through a time when you had to overcome challenge or achieve goal?
1. A specific story or anecdote that demonstrates your problem-solving skills.
2. A clear explanation of the challenge or goal you faced.
3. The steps you took to overcome the challenge or achieve the goal.

What are your thoughts on BananaCrystal initiative or goal?
1. Research-based information about the BananaCrystal initiative or goal.
2. A clear understanding of how the initiative or goal aligns with the company's mission and values.
3. Any ideas or suggestions you have for contributing to the initiative or achieving the goal.