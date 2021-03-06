'use strict';

import React from 'react';

import { Module, connect, requiredProp } from '../../core';

import { greaterZeroValidator } from '../../utils/validators';

import TableListComponent, { GraphConfig } from '../../components/tableListComponent';

import CaseResultsTableDataEngine from './engine';
import caseResultsTableListTemplate from './template';


const FILTER_OPTIONS = [
    [
        {
            type: 'date',
            name: 'date_from',
            title: 'Date from',
            placeholder: 'Date'
        },
        {
            type: 'date',
            name: 'date_to',
            title: 'Date to',
            placeholder: 'Date'
        }
    ],
    [
        {
            type: 'float',
            name: 'runtime_less',
            title: 'Runtime less',
            placeholder: 'Float',
            validator: greaterZeroValidator,
            errorMessage: 'Runtime can be greater or equal 1'
        },
        {
            type: 'float',
            name: 'runtime_more',
            title: 'Runtime more',
            placeholder: 'Float',
            validator: greaterZeroValidator,
            errorMessage: 'Runtime can be greater or equal 1'
        }
    ],
    {
        type: 'select',
        name: 'status',
        selectOptions: {
            Any: '',
            Failed: 'failed',
            Error: 'error',
            Passed: 'passed',
            Skipped: 'skipped'
        },
        title: 'Status'
    },
    {
        type: 'select',
        name: 'sort_by',
        selectOptions: {
            Date: 'date',
            Runtime: 'runtime'
        },
        title: 'Sort by'
    }
];


@connect(
    new CaseResultsTableDataEngine()
)
export default class CaseResultsTableListModule extends Module  {

    @requiredProp
    get job() {
        return this.props.job
    }

    @requiredProp
    get case() {
        return this.props.case
    }

    @requiredProp
    get location() {
        return this.props.location
    }

    getData(...args) {
        this.actions.getCaseResultsTableData(...[this.job, this.case, ...args])
    }

    render() {
        let graphConfig = new GraphConfig();

        graphConfig.isClickable = true;
        graphConfig.ignoreErrors = true;
        graphConfig.calculateFromField = 'runtime';

        let tableListProps = {
            graphConfig,
            colorMap: {
                red: 'error',
                orange: 'fail',
                green: 'passed',
                gray: 'skipped'
            },
            location: this.location,
            filterOptions: FILTER_OPTIONS,
            tableTemplate: caseResultsTableListTemplate,
            getData: this.getData.bind(this),
            apiState: this.states.caseResultsTableDataState
        };

        return <TableListComponent {...tableListProps}/>
    }

}

