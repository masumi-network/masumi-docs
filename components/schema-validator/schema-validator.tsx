'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

export const EXAMPLES = [
    {
      label: 'Multiple Fields (Default)',
      value: `[
    {
      "id": "name",
      "type": "text",
      "name": "Full Name",
      "data": {
        "placeholder": "Enter your full name",
        "description": "Your complete name as it appears on official documents"
      },
      "validations": [
        { "validation": "min", "value": "2" },
        { "validation": "max", "value": "100" }
      ]
    },
    {
      "id": "email",
      "type": "email",
      "name": "Email Address",
      "data": {
        "placeholder": "your.email@example.com",
        "description": "Your primary email address"
      },
      "validations": [
        { "validation": "format", "value": "email" }
      ]
    },
    {
      "id": "age",
      "type": "number",
      "name": "Age",
      "data": {
        "description": "Your current age (optional)"
      },
      "validations": [
        { "validation": "optional", "value": "boolean" },
        { "validation": "min", "value": "18" },
        { "validation": "max", "value": "120" },
        { "validation": "format", "value": "integer" }
      ]
    },
    {
      "id": "interests",
      "type": "option",
      "name": "Interests",
      "data": {
        "description": "Select your areas of interest",
        "values": ["Technology", "Sports", "Music", "Art", "Science", "Travel"]
      },
      "validations": [
        { "validation": "min", "value": "1" },
        { "validation": "max", "value": "3" }
      ]
    },
    {
      "id": "newsletter",
      "type": "boolean",
      "name": "Newsletter Subscription",
      "data": {
        "description": "Subscribe to our newsletter for updates (optional)"
      },
      "validations": [
        { "validation": "optional", "value": "boolean" }
      ]
    }
  ]`,
    },
    {
      label: 'Email Input',
      value: `{
    "id": "email-input",
    "type": "email",
    "name": "Email",
    "data": {
      "placeholder": "Enter your email",
      "description": "User email address"
    },
    "validations": [
      { "validation": "format", "value": "email" },
      { "validation": "min", "value": "5" },
      { "validation": "max", "value": "55" }
    ]
  }`,
    },
    {
      label: 'Number Input',
      value: `{
    "id": "age-input",
    "type": "number",
    "name": "Age",
    "data": {
      "description": "User's age in years (optional)"
    },
    "validations": [
      { "validation": "optional", "value": "boolean" },
      { "validation": "min", "value": "18" },
      { "validation": "max", "value": "120" },
      { "validation": "format", "value": "integer" }
    ]
  }`,
    },
    {
      label: 'Option Input',
      value: `{
    "id": "company-type",
    "type": "option",
    "name": "Company type",
    "data": {
      "description": "Please select the legal entity to analyze",
      "values": ["AG", "GmbH", "UG"]
    },
    "validations": [
      { "validation": "min", "value": "1" },
      { "validation": "max", "value": "1" }
    ]
  }`,
    },
    {
      label: 'Boolean Input',
      value: `{
    "id": "terms-accepted",
    "type": "boolean",
    "name": "Accept Terms",
    "data": {
      "description": "I agree to the terms and conditions"
    }
  }`,
    },
    {
      label: 'File Input',
      value: `{
    "id": "document-upload",
    "type": "file",
    "name": "Document Upload",
    "data": {
      "description": "PDF or Word documents only (max 4.5MB)",
      "outputFormat": "url"
    },
    "validations": [
      { "validation": "accept", "value": ".pdf,.doc,.docx" },
      { "validation": "min", "value": "1" },
      { "validation": "max", "value": "1" }
    ]
  }`,
    },
    {
      label: 'With Optional Wrapper',
      value: `{
    "input_data": [
      {
        "id": "project-name",
        "type": "text",
        "name": "Project Name",
        "data": {
          "placeholder": "Enter project name",
          "description": "The name of your project"
        },
        "validations": [
          { "validation": "min", "value": "3" },
          { "validation": "max", "value": "50" }
        ]
      },
      {
        "id": "description",
        "type": "textarea", 
        "name": "Description",
        "data": {
          "placeholder": "Describe your project",
          "description": "Brief description of the project (optional)"
        },
        "validations": [
          { "validation": "optional", "value": "boolean" },
          { "validation": "max", "value": "500" }
        ]
      },
      {
        "id": "document",
        "type": "file",
        "name": "Project Document",
        "data": {
          "description": "Upload project documentation (PDF/Word, max 4.5MB)",
          "outputFormat": "url"
        },
        "validations": [
          { "validation": "accept", "value": ".pdf,.doc,.docx" },
          { "validation": "min", "value": "1" },
          { "validation": "max", "value": "1" }
        ]
      },
      {
        "id": "priority",
        "type": "option",
        "name": "Priority Level",
        "data": {
          "description": "Select the priority level",
          "values": ["Low", "Medium", "High", "Critical"]
        },
        "validations": [
          { "validation": "min", "value": "1" },
          { "validation": "max", "value": "1" }
        ]
      }
    ]
  }`,
    },
  ];
  
  


const SchemaPlayground = dynamic(
  async () =>
    (await import('masumi-schema-validator-component')).SchemaPlayground,
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full animate-pulse bg-muted/20 rounded-lg border border-muted flex items-center justify-center">
        <span className="text-muted-foreground">Loading Validator...</span>
      </div>
    ),
  },
);

export const SchemaValidator = () => {
  // Detect theme from the app (single source of truth)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Watch for theme changes on the document element
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <SchemaPlayground 
      examples={EXAMPLES}
      initialSchema={EXAMPLES[0].value}
      onSchemaChange={() => {}}
      className="not-prose"
      theme={theme}
    />
  );
};

export default SchemaValidator;
