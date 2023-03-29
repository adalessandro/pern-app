import { message, Space } from "antd";
import { AxiosResponse } from "axios";
import React from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/user/userSlice";
import { userRoles } from "./types";

export const CNT_VERSION = 'v0.2';

export const showSuccess = (msg: string) => {
  message.success(msg, 2);
};

export const showWarning = (msg: string) => {
  message.warning(msg, 2);
}

export const showError = (msg: string) => {
  message.error(msg, 2);
};


export function downloadFile(request: AxiosResponse, filename: string) {
  const url = window.URL.createObjectURL(new Blob([request.data]));
  const link = document.createElement("a");
  link.href = url;
  const disposition = request.headers['content-disposition']
  /*
  let filename = 'source.zip';
  if (disposition && disposition.indexOf('attachment') !== -1) {
    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  */
  link.setAttribute("download", `${filename}`);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(link.href);
  showSuccess('File downloaded');
}

export function useHasPermissions(requiredRole: userRoles): boolean {
  const user = useAppSelector(selectUser);

  if (user.role === userRoles.Read && requiredRole !== userRoles.Read) {
    return false;
  }

  if (user.role === userRoles.Write && requiredRole === userRoles.Root) {
    return false;
  }

  return true;
}

export function usePermissions(x: JSX.Element, role: userRoles): JSX.Element | null {
  const user = useAppSelector(selectUser);

  if (user.role === userRoles.Read && role !== userRoles.Read) {
    return null;
  }

  return x;

}

export function CenterText(props: React.PropsWithChildren): JSX.Element {
  return (
    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
     {props.children} 
    </Space>
    );
}


export const projectColors = ['#F69E0A', '#81C0B7', '#FCE22E', '#3275FD', '#9984E7',
  '#9713BA', '#83C106', '#787292', '#79FEC5', '#C84D29',
  '#CBA83F', '#C97A8D', '#3DF624', '#6680B3', '#66991A'];

