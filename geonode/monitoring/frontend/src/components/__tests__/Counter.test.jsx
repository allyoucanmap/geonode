/*
#########################################################################
#
# Copyright (C) 2019 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################
*/

import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Counter } from '../Counter';

describe('Counter', () => {
    afterEach(cleanup);
    it('should append suffix for counts greater than 999', () => {
        const { getByText, rerender } = render(<Counter count={999}/>);
        expect(getByText(/999/i)).toBeTruthy();
        rerender(<Counter count={1000}/>);
        expect(getByText(/1.0k/i)).toBeTruthy();
        rerender(<Counter count={1700}/>);
        expect(getByText(/1.7k/i)).toBeTruthy();
        rerender(<Counter count={1000000}/>);
        expect(getByText(/1.0m/i)).toBeTruthy();
    });
});
