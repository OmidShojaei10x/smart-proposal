// Configuration file for SmartProposal Landing Page
// Copy this file to config.js and fill in your actual values
// Make sure config.js is in .gitignore to keep your tokens secure

const CONFIG = {
    // Formspree Configuration
    // Get your endpoint from https://formspree.io after creating a form
    formspreeEndpoint: "https://formspree.io/f/xvzoolnr",
    
    // GitHub Configuration
    // Create a Personal Access Token at: https://github.com/settings/tokens
    // Required scopes: repo, issues:write
    githubToken: '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',
    githubRepo: 'OmidShojaei10x/smart-proposal', // e.g., 'OmidShojaei10x/smart-proposal'
    githubLabels: ['contact-form', 'new-lead'], // Optional: labels to add to issues
    
    // ClickUp Configuration
    // Get API Token from: https://app.clickup.com/settings/apps
    // Get List ID from ClickUp URL or API
    clickupToken: 'pk_32675396_4D2JH6OGUWNVY5OPW4FH7L17DKUFKKWI',
    clickupListId: '901519154681', // e.g., '123456789'
    clickupStatus: 'to do', // Optional: default status for new tasks
    clickupPriority: 1 // Optional: priority (1=urgent, 2=high, 3=normal, 4=low)
};


