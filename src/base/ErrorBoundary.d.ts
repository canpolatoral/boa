import * as React from 'react';
import ComponentBase, { ComponentBaseProps, ComponentBaseInstance } from './ComponentBase';

interface ErrorBoundaryProps extends ComponentBaseProps {
}

interface ErrorBoundaryInstance extends ComponentBaseInstance {
}


export default class ErrorBoundary extends ComponentBase<ErrorBoundaryProps, ErrorBoundaryInstance> { }
